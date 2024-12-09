import { useState, useEffect, delay, useContext } from "react";

import MainPannel from "../components/MainPannel";
import MasterHeader from "../components/MasterHeader";
import RightPannel from "../components/RightPannel";
import { CSSTransition} from 'react-transition-group';
import { CallBetweenPhrase, CallAfterSentence } from "../api/claude"
import { IsRightPannelVisibleContext, AnswerStateContext, AnswerDetailsContext, MemberAccountContext } from '../ContextProvider';
import '../styles/Home.css'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
// import { useBlocker, useNavigate} from "react-router-dom";       // 라우터를 통한 이동시 차단 or 알림창 띄우기. 참고: https://choisuhyeok.tistory.com/140 
import { GetMemberAccount } from "../api/auth";         
import { useNavigate } from "react-router-dom"; 
import { useBeforeunload } from "react-beforeunload";       //새로고침 or 뒤로가기 or 링크임의변경 시 알림창 띄우기. 참고: https://www.npmjs.com/package/react-beforeunload
import { useBlocker } from "react-router-dom";              // 라우터를 통한 이동시 차단 or 알림창 띄우기. 참고: https://choisuhyeok.tistory.com/140


function Home() {
    const navigate = useNavigate(); // useNavigate를 컴포넌트 내부에서 호출
    //
    //전역변수
    const { state: {answerState}, actions:{setAnswerState} } = useContext(AnswerStateContext);
    const { state: {answerDetails}, actions:{setAnswerDetails} } = useContext(AnswerDetailsContext);
    const { state: {memberAccount}, actions:{setMemberAccount} } = useContext(MemberAccountContext);
    //
    //

    const [answers, setAnswers] = useState(["","",""]);
    const [changedContentInfo, setChangedContentInfo] = useState(["", false, "", "", [0,0]]);
    const [cursorIdx, setCursorIdx] = useState(0);
    const [draggedIdx, setDraggedIdx] = useState([0,0]);
    const [content, setContent] = useState("");
    const [requestMsg, setRequestMsg] = useState("");
    const [responseErrorMsg, setResponseErrorMsg] = useState("");

    //home 들어올때마다 로그인했는지 확인 요청하기
    //로그인했으면 

    const [isMember, setIsMember] = useState(false);
    const [isBlockerActive, setIsBlockerActive] = useState(false);

    useEffect(() => {
        async function a() {
            const _memberAccount = await GetMemberAccount();     //토큰 총 수 가져오기
            if (_memberAccount.userName === "NON_MEMBER") {
                navigate("/tutorial");
            } else {
                setIsBlockerActive(true);
            }
        }
        a();
    }, [])


    // 새로고침 or 뒤로가기 시 알림창 띄우기
    useBeforeunload((event) => {event.preventDefault()});

    // =====라우터를 통한 이동시 알림창 띄우기 =====//
    const blocker = useBlocker(({ currentLocation, nextLocation }) => {
            // return currentLocation.pathname !== nextLocation.pathname;
            return isBlockerActive && currentLocation.pathname !== nextLocation.pathname
        }
    );

    useEffect(() => {
        if (blocker.state !== "blocked") return;
        if (window.confirm(`사이트를 벗어나시겠습니까? \n변경사항이 저장되지 않을 수 있습니다.`)) {
            blocker.proceed();
        } else {
            blocker.reset();
        }
    }, [blocker.state]);

    // ===========================================//
    


    //웹갱신시 or api 요청 직후 
    //회원/게스트 여부 확인, token 개수 확인
    useEffect(() => {
        async function a() {
            const _memberAccount = await GetMemberAccount();     //토큰 총 수 가져오기
            if (_memberAccount.userName === "NON_MEMBER") {
                setMemberAccount(_memberAccount);
                return;
            }
            //회원인 경우
            // setTokenSum(memberAccount.tokenSum);
            setMemberAccount(_memberAccount);
            setIsMember(true);
        }
        a();
    }, [answerState]);


    const handleRequestedHelp = async ([_requestMsg, _content, _idx]) => {
        // const txt = `유전자 가위 기술의 발달로 이제 우리는 1.12의 유전자를 편집하는 힘을 얻게 되었다? 이로 인해 유전적 질병의 치료뿐만 아니라 자질 강화는 물론이고 자녀의 유전자마저 결정할 수 있다? 바야흐로 인간은 자연 진화의 주인 자리에 올라 진정 만물의 영장이 되었다. 하지만 유전 정보 및 유전자 편집의 힘은 윤리적, 사회적으로 적지 않은 파장을 일으키고 있다. 생물 안정성이라는 기술상의 위험 요소는 물론이거나 이중 사용의 딜레마로 인한 바이오 테러 등의 생물 보안도 큰 사회적 이슈이다. 이러한 위험보다 더 심각한 것은 윤리물음이다. 동식물 대상의 유전자 편집은 동물권 물음을 야기하고, 인간 대상 유전자 편집은 치료를 넘어 자질 강화를 낳는 유전자 성형의 경우 정의와 연관하여 접근 기회의 공평성, 결과의 평등, 절차적 공정성 등의 윤리 원칙을 요구한다. 특히 맞춤아기의 경우처럼 다음 세대에 유전되는 생식세포 유전자 편집은 부모에 의한 자녀의 유전자 선택으로 부모와 자녀의 관계를 근본적으로 바꾸어 놓을 것이다. 윤리적 유전자 편집을 위한 민주적 숙의 과정이 그 어느 때보다 절실하게`;
        // const idx = [28,30];            //유전자
        // const currentTxt = `이로 인해 유전적 질병의 치료뿐만 아니라 자질 강화는 물론이고 자녀의 유전자마저 결정할 수 있다. 바야흐로 인간은 자연 진화의 주인 자리에 올라`;

        // if (_requestMsg !== null) {
        //     return null;
        // }
        // const currentTxt = _content;    //afterSentence의 경우 사용
        
        let isSucceed = false;
        let msg = "";
        if (_requestMsg === "") {return;}
        setResponseErrorMsg("");
        setAnswerState("LOADING");
        console.log("loading")
        if (_requestMsg === "draggedText") {
            setContent(_content);
            setDraggedIdx(_idx);
            setRequestMsg(_requestMsg);
            const response = await CallBetweenPhrase([_content, _idx]);
            isSucceed = response.isSucceed;
            msg = response.msg;
        } else if (_requestMsg === "afterSentence") {
            setContent(_content);
            setCursorIdx(_idx);
            setRequestMsg(_requestMsg);
            const slicedContent = _content.slice(0, _idx);
            const response = await CallAfterSentence(slicedContent);
            isSucceed = response.isSucceed;
            msg = response.msg;
        } else if (_requestMsg === "retry") {   //재시도 요청한 경우
            if (!content) {
                isSucceed = false;
                msg = "이전 요청건이 없습니다";
            } else {
                //단어/구 재검색
                if (requestMsg === "draggedText"){     
                    //이전 요청건이 'selectedText'인 경우
                        const response = await CallBetweenPhrase([content, draggedIdx]);
                        isSucceed = response.isSucceed;
                        msg = response.msg;
                } else if (requestMsg === "afterSentence"){
                    //이전 요청건이 'afterSentence' 인 경우
                    const slicedContent = content.slice(0, cursorIdx);
                    const response = await CallAfterSentence(slicedContent);
                    isSucceed = response.isSucceed;
                    msg = response.msg;
                }
            }
        } 
        

        //단어/구 ai 검색
        // const answerList = await getAnswerList3BetweenPhrase([txt, idx]);
        
        if (isSucceed) {
            console.log("CallBetweenPhrase 성공");
            const [answer1, answer2, answer3] = msg;
            setAnswers([answer1, answer2, answer3]);
            console.log(msg);
            setAnswerState("RECEIVED");
        } else {
            console.log("CallBetweenPhrase 실패");
            console.log(msg);
            setResponseErrorMsg(msg);
            setAnswerState("ERROR");
        }


    
    }

    const handleChangeContent = async (isApply, txt) => {
        if (requestMsg === "" || content === "") {;return;}
        if (requestMsg === "draggedText") {
            setChangedContentInfo([requestMsg, isApply, txt, content, draggedIdx]);
            
        } else if (requestMsg === "afterSentence"){
            setChangedContentInfo([requestMsg, isApply, txt, content, cursorIdx]);
        }

    }



    return (
        <div>
            {/* <MasterHeader /> */}
            <div className="h-pannel-container">
                <div>
                    <br/><br/><br/>
                </div>
                {/* <button onClick={handleApiCall}>gpt call</button> */}
                <MainPannel onRequestedHelp={handleRequestedHelp} changedContentInfo={changedContentInfo}/>
                <RightPannel onRequestedHelp={handleRequestedHelp} response={answers} onChangeContent={handleChangeContent} responseErrorMsg={responseErrorMsg}/>
            </div>
        </div>
    );
}

export default Home;







