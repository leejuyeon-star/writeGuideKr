import PropTypes from "prop-types";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import '../../styles/RightPannel.css'
import { CSSTransition } from 'react-transition-group';
import AiAnswer from "./AiAnswerForGuest";
import { IsRightPannelVisibleContext, AnswerStateContext } from '../../ContextProvider';

function RightPannelForGuest({ onRequestedHelp, response, onChangeContent, responseErrorMsg }) {
    const { state: {answerState}, actions:{setAnswerState} } = useContext(AnswerStateContext);

    const { state, actions } = useContext(IsRightPannelVisibleContext);
    const { isRightPannelVisible } = state;
    const { setIsRightPannelVisible } = actions;
    const closeImgUrl =  process.env.PUBLIC_URL + "/images/close_pane.png";

    //자식에게 받은 값 부모에게 전달하기
    const handleRequestedHelp = (...param) => {
        onRequestedHelp(param[0]);
    };

    //자식에게 받은 값 부모에게 전달하기
    const handleChangeContent = (...param) => {
        onChangeContent(param[0], param[1]);
    };

    //창 닫기
    const onClickCloseButton = () => {
        setIsRightPannelVisible(false);
    }

    return (
        <>
            <CSSTransition
                in={isRightPannelVisible}
                timeout={700}
                classNames="slide"
                // mountOnEnter
                unmountOnExit
            >
                <div className="rp-main-container">
                    <header className="rp-header">
                        <h2 className="rp-header-title">수정하기</h2>
                        <button className="rp-close-button" onClick={onClickCloseButton}>
                            <img src={closeImgUrl} className="rp-close-img"/>
                        </button>
                    </header>
                    <AiAnswer onRequestedHelp={handleRequestedHelp} response={response} onChangeContent={handleChangeContent} responseErrorMsg={responseErrorMsg}/>
                    <div className="rp-advertise-container">광고패널</div>
                </div>
            </CSSTransition>
        </>

    );
}


export default RightPannelForGuest;