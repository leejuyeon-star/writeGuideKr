import PropTypes from "prop-types";
import { useEffect, useState,useContext } from "react";
import { useParams } from "react-router-dom";
import '../styles/MainPannel.css';
import { Transition } from 'react-transition-group';
// import MainNote from "./MainNote";
import MainNote from "../mainPannelFolder/MainNote";
import { IsRightPannelVisibleContext, AnswerStateContext } from '../../ContextProvider';
import MasterFooter from "../MasterFooter"


function MainPannel({ onRequestedHelp, changedContentInfo}) {
    const { state: {isRightPannelVisible}, actions:{setIsRightPannelVisible} } = useContext(IsRightPannelVisibleContext);
    const { state: {answerState} } = useContext(AnswerStateContext);

    //자식에게 받은 값 부모에게 전달하기 (ai 요청, 패널 열라고 하기)
    const handleRequestedHelp = (...param) => {
        //현재 패널 열려있으면 고정, 아니면 이동
        onRequestedHelp(param[0]);
        if (!isRightPannelVisible){
            setIsRightPannelVisible(true);
            // setIsRightPannelVisible(true);
        }
        // setIsDraggedButtonOn(false);
    };
 

    return (
        <>
            <Transition in={isRightPannelVisible} timeout={700}>
                {(state) => (
                    <div className={`mp-transition-container mp-${state}`}>
                        <div className="mp-container">
                            <div className="mp-sub-container">
                                <MainNote onRequestedHelp={handleRequestedHelp} changedContentInfo={changedContentInfo}/>
                            </div>
                        </div>
                        <div>
                            <br/><br/><br/>
                        </div>
                        <div className="mp-advertise-container">
                            광고    
                        </div>
                        <MasterFooter />
                        

                    </div>
                )}
            </Transition>
        </>
    );    
}


export default MainPannel;

