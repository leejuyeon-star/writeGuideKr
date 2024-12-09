import PropTypes from "prop-types";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import '../../styles/rightPannelFolder/AiAnswer.css'
import { IsRightPannelVisibleContext, AnswerStateContext,  MemberAccountContext} from '../../ContextProvider';


function AiAnswer({ onRequestedHelp, response, onChangeContent, responseErrorMsg }) {
    const { state: {answerState}, actions:{setAnswerState} } = useContext(AnswerStateContext);
    const { state: {memberAccount}, actions:{setMemberAccount} } = useContext(MemberAccountContext);

    const [responseTxt, setResponseTxt] = useState("");
    const [isClickedResponseTextButton, setIsClickedResponseTextButton] = useState([false, 0]);
    const [animationSwitch, setAnimationSwitch] = useState(false);      //dom 업테이트를 통해 애니메이션 업데이트 하기 위함
    const [isClicked, setIsClicked] = useState(["","",""]);
    const warningImgUrl = process.env.PUBLIC_URL + "/images/warning_yellow.png";
    const retryImgUrl = process.env.PUBLIC_URL + "/images/retry.png";

    useEffect(() => {
        // 기본 텍스트를 설정합니다.
        if (answerState === "LOADING"){
            setIsClicked(["","",""]);
            setIsClickedResponseTextButton([false, 0]);
        }
        if (answerState === "ERROR") {
            setAnimationSwitch(!animationSwitch);
        }
    }, [answerState]);

    const handleResponseTextButtonMouseOver = (event) => {
        if (isClickedResponseTextButton[0]) {return;}
        //색 바뀌고
        //내용 바뀌고
        //1번째 내용 바꿔라! 신호 보내기
        console.log(event.target.id);
        const txt = event.target.innerText;
        onChangeContent(false, txt);
    }

    const handleResponseTextButtonMouseOut = () => {
        if (isClickedResponseTextButton[0]) {return;}
        //색 원래대로
        //내용 원래대로
        onChangeContent(false, "");
    }
    
    const handleResponseTextButtonClick = (event) => {
        const buttonId = event.target.id;
        setIsClickedResponseTextButton([true, buttonId]);
        const txt = event.target.innerText;
        setResponseTxt(txt);
        // onChangeContent(false, txt);
        // isClicked
        setIsClicked("","","");
        if (buttonId == "1") {
            setIsClicked([" clicked","",""]);
        } else if (buttonId == "2") {
            setIsClicked([""," clicked",""]);
        } else if (buttonId == "3") {
            setIsClicked(["",""," clicked"]);
        }
        onChangeContent(true, txt);
        setAnswerState("IDLE");
    }

    const handleClickRetry = (event) => {
        setIsClicked("","","");
        hideTooltip(event);
        onRequestedHelp(["retry", "", [0,0]]);
    }

    const hideTooltip = (event) => {
        const classList = event.currentTarget.classList;
        if (!classList.contains('clicked')){
            classList.toggle('clicked');
        }
    }

    // const handleClickConfirm = () => {
    //     setIsClicked("","","");
    //     onChangeContent(true, responseTxt);
    //     setAnswerState("IDLE");
    // }

    



    return (
        <>
            {answerState === "IDLE" ? 
                <div className="aa-textarea-section">
                    <div className="aa-idle-section">AI 검색 대기중입니다</div> 
                </div>
                :
                ((answerState === "LOADING") || (answerState === "RELOADING")  ? 
                    <div className="aa-textarea-section">
                        {/* <div className="aa-loading-section"> */}
                            <div className="aa-loading-animation-box">
                                    <div className="aa-loading-animation-loader"></div>
                            </div>
                        {/* </div> */}
                        {/* <div className="aa-loading-section">
                            <div className="aa-loading-animation-box">
                                    <div className="aa-loading-animation-loader"></div>
                            </div>
                        </div>
                        <div className="aa-loading-section">
                            <div className="aa-loading-animation-box">
                                    <div className="aa-loading-animation-loader"></div>
                            </div>
                        </div> */}
                    </div>
                    :
                    (answerState === "RECEIVED" ?
                        <div className="aa-textarea-section">
                            <button 
                                id="1"
                                className={`aa-response-text-button${isClicked[0]}`}
                                onMouseOver={handleResponseTextButtonMouseOver}
                                onMouseOut={handleResponseTextButtonMouseOut}
                                onClick={handleResponseTextButtonClick}
                            >
                                {response[0]}
                            </button>
                            <button 
                                id="2"
                                className={`aa-response-text-button${isClicked[1]}`}
                                onMouseOver={handleResponseTextButtonMouseOver}
                                onMouseOut={handleResponseTextButtonMouseOut}
                                onClick={handleResponseTextButtonClick}
                            >
                                {response[1]}
                            </button>
                            <button 
                                id="3"
                                className={`aa-response-text-button${isClicked[2]}`} 
                                onMouseOver={handleResponseTextButtonMouseOver}
                                onMouseOut={handleResponseTextButtonMouseOut}
                                onClick={handleResponseTextButtonClick}
                            >
                                {response[2]}
                            </button>
                            <div className="aa-textarea-bottom-section">
                                {/* <button onClick={handleClickRetry} className="aa-retry-button" tooltip="재시도" flow="right">
                                    <img src={retryImgUrl} className="aa-retry-img"/>
                                </button> */}
                                {/* <div className="aa-tokenSum">{memberAccount.tokenSum}토큰</div> */}
                            </div>
                            {/* {isClickedResponseTextButton[0]  ? */}
                                {/* <button onClick={handleClickConfirm}>결정</button> */}
                                {/* : null */}
                            {/* } */}
                        </div>
                    : 
                    
                    (answerState === "ERROR" ? 
                        animationSwitch ? 
                            <div className="aa-textarea-section">
                                <div className="aa-error-container switch1">
                                    <div className="aa-error-header">
                                        <img src={warningImgUrl} className="image"/> 실패 <img src={warningImgUrl} className="image"/>
                                    </div>
                                    {responseErrorMsg}
                                </div>
                            </div>
                            :
                            <div className="aa-textarea-section">
                                <div className="aa-error-container switch2">
                                    <div className="aa-error-header">
                                        <img src={warningImgUrl} className="image"/> 실패 <img src={warningImgUrl} className="image"/>
                                    </div>
                                    {responseErrorMsg}
                                </div>
                            </div>

                        : null
                    )
                    )
                )}
        </> 

    );
}


export default AiAnswer;