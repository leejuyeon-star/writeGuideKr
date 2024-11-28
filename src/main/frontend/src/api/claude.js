
//CORS 방지를 위한 프록시 설정
import { useEffect, useState } from "react";
import axios from 'axios';

export const CallBetweenPhrase = async ([txt, idx]) => {
    async function getResponsePost(jsonRequestMsg) {
        try{
            console.log("jsonRequestMsg");
            console.log(jsonRequestMsg);
            const response = await axios.post('/api/claude/betweenphrase',
                jsonRequestMsg,
                { "Content-Type": "application/json", withCredentials: true },  //withCredentials: true: 브라우저에서 세션 쿠키(JSESSIONID)를 함께 전송
            );
                console.log("response.data:");
                console.log(response.data);
                return [true, response.data];
        } catch (error) {
            console.log("jsonRequestMsg:");
            console.log(jsonRequestMsg);
            console.log("error:");
            console.log(error);
            return [false, error];
        }        
    }

    const extractSentences = (wholeTxt, targetIdx) => {        //단어가 들어간 문장 하나와 그 앞 문장만 리턴
        if (targetIdx[1] - targetIdx[0] >= 15) {
            return [false, "문장이 아닌 단어구를 선택해주세요"];
        }

        const wholeTextWithoutEnter = txt.replace(/\n/g, ""); // \n을 모두 제거

        // .한개 이상 or ! or ? 뒤가 공백인 것을 기준으로 구분 / 숫자. .숫자 는 제외 
        // let sentences = wholeTxt.split(/(?<!\d)\.{2,}(?!\d)|(?<!\d)\.(?!\d)|[!?]/);
        let sentences = wholeTextWithoutEnter.split(/(?<!\d)\.{2,}(?!\d)|(?<!\d)\.(?!\d)|[!?]/);     //한개 이상의 엔터키 추가
        console.log("sentences1");
        console.log(sentences);

        sentences = sentences.map((sentence, index) => {
            const separator = wholeTextWithoutEnter.match(/(?<!\d)\.{2,}(?!\d)|(?<!\d)\.(?!\d)|[!?]/g)?.[index] || '';
            return sentence + separator; // 문장과 구분자를 합쳐서 반환
            // return sentence.trim() + separator; // 문장과 구분자를 합쳐서 반환
        });
        console.log("sentences2");
        console.log(sentences);
        

        let foundSentenceIndex = -1;
        // let foundWordIdx = [0,0];
        let isFound = false;
        //인덱스로 찾기
        for (let i=0, currentIdx=-1; i<sentences.length; i++) {
            currentIdx += sentences[i].length;
            if (currentIdx >= targetIdx[1]) {
                foundSentenceIndex = i;
                if (i === 0 || i === 1) {
                    // foundWordIdx = targetIdx;
                } else {
                    // foundWordIdx = targetIdx;
                    for (let k=0; k===i-2; k++) {
                        // foundWordIdx[0] -= sentences[k].length;
                        // foundWordIdx[1] -= sentences[k].length;
                    }
                }
                isFound = true;
                break;
            }
            
        }
        const foundSentence = sentences[foundSentenceIndex]

        if (foundSentenceIndex === -1) {
            return [false, "해당 단어가 포함된 문장이 없습니다."];
        }
        if (foundSentence.length > 140) {
            return [false, "문장의 길이가 너무 길거나 문장을 구분할 수 없습니다. \n .!? 표시를 하여 문장을 구분해주세요."];
        }

        if (foundSentenceIndex === 0) {    
            //찾은 문장이 첫문장인 경우
            // return [true, foundSentence, foundWordIdx];
            return [true, foundSentence];
        } else {
            //찾은 문장이 두번째 문장 이상인 경우
            const beforeSentence = sentences[foundSentenceIndex-1];
            if (beforeSentence.length > 140) {
                return [false, "문장의 길이가 너무 길거나 문장을 구분할 수 없습니다. \n .!? 표시를 하여 문장을 구분해주세요."]
            }
            return [true, `${beforeSentence} ${foundSentence}`];
            // return [true, `${beforeSentence} ${foundSentence}`, foundWordIdx];
        }
    }

    
    const extractBeforeTargetWord = (wholeText, index, _targetSentence, _targetWord) => {
        let isTargetWordMoreThanOne = false;
        if (_targetSentence.split(_targetWord).length > 2) {isTargetWordMoreThanOne = true;};

        if (isTargetWordMoreThanOne) {
            let beforeTargetWord = "";
            //단어 중복이 있는 경우 
            if (index[0] <= 1) {return null}//하 미치겠네 첫문장 첫글자인데 중복인 경우는 어떻게 하냐..에바임 걍 알아서해..
            let i=1;
            while (true) {
                i++;
                if (wholeText[index[0]-i] === " " && i>3) {
                    break;
                } else if (index[0] <= i){
                    break;
                }
            }
            beforeTargetWord = wholeText.slice(index[0]-i, index[0]).trim();
            
            return beforeTargetWord;
        } else {
            //단어 중복이 없는 경우
            console.log("단어 중복 없음")
            return null;
        }
        
    } 

    const formatJsonIntoAnswerList = (isSucceed, jsonData) => {
        if (isSucceed) {
            if (jsonData.errorMessage === "") {
                console.log("jsonData")
                console.log(jsonData);
    
                console.log(jsonData.message);
                const message = jsonData.message;
                console.log(message.fir, message.sec, message.thir)
                return {isSucceed: true, msg: [message.fir, message.sec, message.thir]};
            } else {
                console.log(jsonData.errorMessage);
                return {isSucceed: false, msg: jsonData.errorMessage};
            }
            
        } else {
            //network error
            return {isSucceed: false, msg: `네트워크 연결 실패. \n 잠시 후 다시 시도해주세요`};
        }
    }

    // const txt = `유전자 가위 기술의 발달로 이제 우리는 1.12의 유전자를 편집하는 힘을 얻게 되었다? 이로 인해 유전적 질병의 치료뿐만 아니라 자질 강화는 물론이고 자녀의 유전자마저 결정할 수 있다? 바야흐로 인간은 자연 진화의 주인 자리에 올라 진정 만물의 영장이 되었다. 하지만 유전 정보 및 유전자 편집의 힘은 윤리적, 사회적으로 적지 않은 파장을 일으키고 있다. 생물 안정성이라는 기술상의 위험 요소는 물론이거나 이중 사용의 딜레마로 인한 바이오 테러 등의 생물 보안도 큰 사회적 이슈이다. 이러한 위험보다 더 심각한 것은 윤리물음이다. 동식물 대상의 유전자 편집은 동물권 물음을 야기하고, 인간 대상 유전자 편집은 치료를 넘어 자질 강화를 낳는 유전자 성형의 경우 정의와 연관하여 접근 기회의 공평성, 결과의 평등, 절차적 공정성 등의 윤리 원칙을 요구한다. 특히 맞춤아기의 경우처럼 다음 세대에 유전되는 생식세포 유전자 편집은 부모에 의한 자녀의 유전자 선택으로 부모와 자녀의 관계를 근본적으로 바꾸어 놓을 것이다. 윤리적 유전자 편집을 위한 민주적 숙의 과정이 그 어느 때보다 절실하게`;
    // const idx = [28,30];            //유전자
    // const idx = [79,82];            //물론이고
    // const idx = [104,107];      //55,58  바야흐로
    // const idx = [542,544];      //120,122 때보다

    const _targetWord = txt.slice(idx[0], idx[1]);
    // const wholeTextWithoutEnter = txt.replace(/\n/g, ""); // \n을 모두 제거
    const [isSuccess, _targetSentence] = extractSentences(txt, idx);
    if (isSuccess) {
        const _targetBeforeWord = extractBeforeTargetWord(txt, idx, _targetSentence, _targetWord);
        if (_targetBeforeWord) {
            // 중복된 단어 있는 경우
            const [_isSucceed, _jsonData] = await getResponsePost({targetWord: _targetWord, targetSentence: _targetSentence, targetBeforeWord: _targetBeforeWord});
            return formatJsonIntoAnswerList(_isSucceed, _jsonData);
            
        } else {
            // 중복된 단어 없는 경우
            const [isSucceed, jsonData] = await getResponsePost({targetWord: _targetWord, targetSentence: _targetSentence, targetBeforeWord: ""});
            return formatJsonIntoAnswerList(isSucceed, jsonData);
        }
    } else {
        //사용자 잘못인 경우
        // return [false, targetSentence];
        return formatJsonIntoAnswerList(false, "잘못된 요청입니다. \n 문장과 단어를 확인해주세요.");
    }
    
}

export const CallAfterSentence = async (txt) => {

    async function getResponsePost(jsonRequestMsg) {
        try{
            console.log("jsonRequestMsg");
            console.log(jsonRequestMsg);
            const response = await axios.post('/api/claude/aftersentence',
                jsonRequestMsg,
                { "Content-Type": "application/json", withCredentials: true },);
                console.log("response.data:");
                console.log(response.data);
                return [true, response.data];
        } catch (error) {
            //서버가 실행되지 않는 경우
            console.log("error:");
            console.log(error);
            return [false, `네트워크 연결 실패. \n 잠시 후 다시 시도해주세요.`];
        }        
    }

    const extractSentences = (wholeTxt) => {        //맨끝 문장 하나와 그 앞 문장만 리턴
        console.log(wholeTxt);
        if (wholeTxt.length <= 15) {return [false, "문장이 너무 짧습니다."];}
        const wholeTextWithoutEnter = txt.replace(/\n/g, ""); // \n을 모두 제거
        // const wholeTextWithoutEnter = wholeTxt.replace(/\n/g, ""); // \n을 모두 제거
        // .한개 이상 or ! or ? 뒤가 공백인 것을 기준으로 구분 / 숫자. .숫자 는 제외 
        let sentences = wholeTextWithoutEnter.split(/(?<!\d)\.{2,}(?!\d)|(?<!\d)\.(?!\d)|[!?]/);      
        sentences = sentences.map((sentence, index) => {
            const separator = wholeTextWithoutEnter.match(/(?<!\d)\.{2,}(?!\d)|(?<!\d)\.(?!\d)|[!?]/g)?.[index] || '';   
            return sentence + separator; // 문장과 구분자를 합쳐서 반환
            // return sentence.trim() + separator; // 문장과 구분자를 합쳐서 반환
        });

        
        if (sentences.length === 1){
            return [true, wholeTxt];
        } else {
            const targetSentence = `${sentences[(sentences.length -2)]}${sentences[(sentences.length-1)]}`;
            console.log("targetSentence[-1]");
            console.log(sentences[(sentences.length-1)]);
            console.log("targetSentence[-2]");
            console.log(sentences[(sentences.length -2)]);
            console.log("targetSentence3");
            return [true, targetSentence];
        }

    }
 

    const formatJsonIntoAnswerList = (isSucceed, jsonData) => {
        if (isSucceed) {
            if (jsonData.errorMessage === "") {
                console.log("jsonData")
                console.log(jsonData);
    
                console.log(jsonData.message);
                const message = jsonData.message;
                console.log(message.fir, message.sec, message.thir)
                return {isSucceed: true, msg: [message.fir, message.sec, message.thir]};
            } else {
                console.log(jsonData.errorMessage);
                return {isSucceed: false, msg: jsonData.errorMessage};
            }
            
        } else {
            //network error
            return {isSucceed: false, msg: jsonData};
        }
    }

    // const txt = `유전자 가위 기술의 발달로 이제 우리는 1.12의 유전자를 편집하는 힘을 얻게 되었다? 이로 인해 유전적 질병의 치료뿐만 아니라 자질 강화는 물론이고 자녀의 유전자마저 결정할 수 있다? 바야흐로 인간은 자연 진화의 주인 자리에 올라 진정 만물의 영장이 되었다. 하지만 유전 정보 및 유전자 편집의 힘은 윤리적, 사회적으로 적지 않은 파장을 일으키고 있다. 생물 안정성이라는 기술상의 위험 요소는 물론이거나 이중 사용의 딜레마로 인한 바이오 테러 등의 생물 보안도 큰 사회적 이슈이다. 이러한 위험보다 더 심각한 것은 윤리물음이다. 동식물 대상의 유전자 편집은 동물권 물음을 야기하고, 인간 대상 유전자 편집은 치료를 넘어 자질 강화를 낳는 유전자 성형의 경우 정의와 연관하여 접근 기회의 공평성, 결과의 평등, 절차적 공정성 등의 윤리 원칙을 요구한다. 특히 맞춤아기의 경우처럼 다음 세대에 유전되는 생식세포 유전자 편집은 부모에 의한 자녀의 유전자 선택으로 부모와 자녀의 관계를 근본적으로 바꾸어 놓을 것이다. 윤리적 유전자 편집을 위한 민주적 숙의 과정이 그 어느 때보다 절실하게`;
    // const idx = [28,30];            //유전자
    // const idx = [79,82];            //물론이고
    // const idx = [104,107];      //55,58  바야흐로
    // const idx = [542,544];      //120,122 때보다

    // const _targetWord = txt.slice(idx[0], idx[1]+1);
    // const wholeTextWithoutEnter = txt.replace(/\n/g, ""); // \n을 모두 제거
    
    const [isSuccess, _targetSentence] = extractSentences(txt);
    
    if (isSuccess) {
            const [_isSucceed, _jsonData] = await getResponsePost({targetSentence: _targetSentence});
            return formatJsonIntoAnswerList(_isSucceed, _jsonData);
    } else {
        //사용자 잘못인 경우
        // return [false, targetSentence];
        return formatJsonIntoAnswerList(false, _targetSentence);
    }
    
}




// export const CallBetweenPhrase = async () => {

//     async function getResponsePost(targetWord, targetSentence, targetBeforeWord) {
//         try{
//             const response = await axios.post('/api/claude/betweenphrase',
//                 {
//                     targetWord: targetWord,
//                     targetSentence: targetSentence,
//                     targetBeforeWord: targetBeforeWord
//                 },
//                 { "Content-Type": "application/json", withCredentials: true },);
//                 console.log(response.data);
//         } catch (error) {
//             console.log(error);
//         }        
//     }
    
//     async function getResponseGet() {
//         try{
//             const response = await axios.get('/api/test',
//                 {
//                     params: {
//                         ID: 12345
//                     },
//                 });
//             console.log(response.data);
//         } catch (error) {
//             console.log(error);
//         }        
//     }

//     const extractSentences = (wholeTxt, targetIdx) => {        //단어가 들어간 문장 하나와 그 앞 문장만 리턴
//         if (targetIdx[1] - targetIdx[0] >= 15) {
//             return [false, "문장이 아닌 단어를 선택해주세요"];
//         }
//         // .한개 이상 or ! or ? 뒤가 공백인 것을 기준으로 구분 / 숫자. .숫자 는 제외 
//         let sentences = wholeTxt.split(/(?<!\d)\.{2,}(?!\d)|(?<!\d)\.(?!\d)|[!?]/);
//         sentences = sentences.map((sentence, index) => {
//             const separator = wholeTxt.match(/(?<!\d)\.{2,}(?!\d)|(?<!\d)\.(?!\d)|[!?]/g)?.[index] || '';
//             return sentence + separator; // 문장과 구분자를 합쳐서 반환
//             // return sentence.trim() + separator; // 문장과 구분자를 합쳐서 반환
//         });
        

//         let foundSentenceIndex = -1;
//         // let foundWordIdx = [0,0];
//         let isFound = false;
//         //인덱스로 찾기
//         for (let i=0, currentIdx=-1; i<sentences.length; i++) {
//             currentIdx += sentences[i].length;
//             if (currentIdx >= targetIdx[1]) {
//                 foundSentenceIndex = i;
//                 if (i === 0 || i === 1) {
//                     // foundWordIdx = targetIdx;
//                 } else {
//                     // foundWordIdx = targetIdx;
//                     for (let k=0; k===i-2; k++) {
//                         // foundWordIdx[0] -= sentences[k].length;
//                         // foundWordIdx[1] -= sentences[k].length;
//                     }
//                 }
//                 isFound = true;
//                 break;
//             }
            
//         }
//         const foundSentence = sentences[foundSentenceIndex]

//         if (foundSentenceIndex === -1) {
//             return [false, "해당 단어가 포함된 문장이 없습니다."];
//         }
//         if (foundSentence.length > 140) {
//             return [false, "문장의 길이가 너무 길거나 각 문장에 . 표시가 없습니다."];
//         }

//         if (foundSentenceIndex === 0) {    
//             //찾은 문장이 첫문장인 경우
//             // return [true, foundSentence, foundWordIdx];
//             return [true, foundSentence];
//         } else {
//             //찾은 문장이 두번째 문장 이상인 경우
//             const beforeSentence = sentences[foundSentenceIndex-1];
//             if (beforeSentence.length > 140) {
//                 return [false, "문장의 길이가 너무 길거나 각 문장에 . 표시가 없습니다."]
//             }
//             return [true, `${beforeSentence} ${foundSentence}`];
//             // return [true, `${beforeSentence} ${foundSentence}`, foundWordIdx];
//         }
//     }

    
//     const extractBeforeTargetWord = (wholeText, index, _targetSentence, _targetWord) => {
//         let isTargetWordMoreThanOne = false;
//         if (_targetSentence.split(_targetWord).length > 2) {isTargetWordMoreThanOne = true;};

//         if (isTargetWordMoreThanOne) {
//             let beforeTargetWord = "";
//             //단어 중복이 있는 경우 
//             if (index[0] <= 1) {return null}//하 미치겠네 첫문장 첫글자인데 중복인 경우는 어떻게 하냐..에바임 걍 알아서해..
//             let i=1;
//             while (true) {
//                 i++;
//                 if (wholeText[index[0]-i] === " " && i>3) {
//                     break;
//                 } else if (index[0] <= i){
//                     break;
//                 }
//             }
//             beforeTargetWord = wholeText.slice(index[0]-i, index[0]).trim();
            
//             return beforeTargetWord;
//         } else {
//             //단어 중복이 없는 경우
//             console.log("단어 중복 없음")
//             return null;
//         }
        
//     } 

//     const txt = `유전자 가위 기술의 발달로 이제 우리는 1.12의 유전자를 편집하는 힘을 얻게 되었다? 이로 인해 유전적 질병의 치료뿐만 아니라 자질 강화는 물론이고 자녀의 유전자마저 결정할 수 있다? 바야흐로 인간은 자연 진화의 주인 자리에 올라 진정 만물의 영장이 되었다. 하지만 유전 정보 및 유전자 편집의 힘은 윤리적, 사회적으로 적지 않은 파장을 일으키고 있다. 생물 안정성이라는 기술상의 위험 요소는 물론이거나 이중 사용의 딜레마로 인한 바이오 테러 등의 생물 보안도 큰 사회적 이슈이다. 이러한 위험보다 더 심각한 것은 윤리물음이다. 동식물 대상의 유전자 편집은 동물권 물음을 야기하고, 인간 대상 유전자 편집은 치료를 넘어 자질 강화를 낳는 유전자 성형의 경우 정의와 연관하여 접근 기회의 공평성, 결과의 평등, 절차적 공정성 등의 윤리 원칙을 요구한다. 특히 맞춤아기의 경우처럼 다음 세대에 유전되는 생식세포 유전자 편집은 부모에 의한 자녀의 유전자 선택으로 부모와 자녀의 관계를 근본적으로 바꾸어 놓을 것이다. 윤리적 유전자 편집을 위한 민주적 숙의 과정이 그 어느 때보다 절실하게`;
//     const idx = [28,30];            //유전자
//     // const idx = [79,82];            //물론이고
//     // const idx = [104,107];      //55,58  바야흐로
//     // const idx = [542,544];      //120,122 때보다

//     const targetWord = txt.slice(idx[0], idx[1]+1);
//     const [isSuccess, targetSentence] = extractSentences(txt, idx);
//     const targetBeforeWord = extractBeforeTargetWord(txt, idx, targetSentence, targetWord);
//     console.log("["+targetBeforeWord+"]");

//     if (isSuccess) {
//         if (targetBeforeWord) {
//             // 중복된 단어 있는 경우
//             getResponsePost(targetWord,targetSentence, targetBeforeWord);
//         } else {
//             // 중복된 단어 없는 경우
//             getResponsePost(targetWord, targetSentence, null);
//         }
//     } else {
//         return targetSentence;
//     }
    
// }



