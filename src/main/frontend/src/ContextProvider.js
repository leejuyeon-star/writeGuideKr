// 전역변수 관리
// 참고1 https://junhee6773.tistory.com/entry/react-useContext-%EA%B0%84%EB%8B%A8-%EB%B3%80%EA%B2%BD-%EB%B0%A9%EB%B2%95 
// 참고2 https://velog.io/@zzangzzong/React-%EC%A0%84%EC%97%AD-%EC%83%81%ED%83%9C-%EA%B4%80%EB%A6%AC
import { createContext, useState } from "react";

export const IsRightPannelVisibleContext = createContext();   //rightPannel 열린상태(true)/닫힌상태(false)
export const AnswerStateContext = createContext();    // 기본상태("IDLE") / 질문을 던지고 기다리는 상태 ("LOADING") / AI에게서 재질문하여 기다리는 상태 ("RELOADING")/ ai에게서 답변을 받은 상태("RECEIVED") / 에러난 상태 ("ERROR")
export const AnswerDetailsContext = createContext();    // 답변 세가지 ["", "", ""]
// export const TokenSumContext = createContext();    // 답변 세가지 ["", "", ""]
export const MemberAccountContext = createContext();    // 답변 세가지 ["", "", ""]

export function ContextProvider({ children }) {
    const [isRightPannelVisible, setIsRightPannelVisible] = useState(false);
    const isRightPannelVisibleValue = {
      state: { isRightPannelVisible },
      actions: { setIsRightPannelVisible},  
    };

    const [answerState, setAnswerState] = useState("IDLE");
    const answerStateValue = {
      state: { answerState },
      actions: { setAnswerState},  
    };

    const [answerDetails, setAnswerDetails] = useState(["","",""]);
    const answerDetailsValue = {
      state: { answerDetails },
      actions: { setAnswerDetails},  
    };

    const [memberAccount, setMemberAccount] = useState({loginId: "", userName: 'NON_MEMBER', tokenSum: 0, nextTokenRefreshTime: '00:00', provider: ''});
    const memberAccountValue = {
      state: { memberAccount },
      actions: { setMemberAccount },  
    };

    return (
      <AnswerDetailsContext.Provider value={answerDetailsValue}>
      <AnswerStateContext.Provider value={answerStateValue}>
      <IsRightPannelVisibleContext.Provider value={isRightPannelVisibleValue}>
      {/* <TokenSumContext.Provider value={tokenSumValue}> */}
      <MemberAccountContext.Provider value={memberAccountValue}>
          {children}
      </MemberAccountContext.Provider>
      {/* </TokenSumContext.Provider> */}
      </IsRightPannelVisibleContext.Provider>
      </AnswerStateContext.Provider>
      </AnswerDetailsContext.Provider>
    );
  }







