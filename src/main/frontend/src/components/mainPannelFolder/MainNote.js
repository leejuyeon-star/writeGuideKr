import PropTypes from "prop-types";
import { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import '../../styles/mainPannelFolder/MainNote.css'
import { Transition } from 'react-transition-group';
import { IsRightPannelVisibleContext, AnswerStateContext, MemberAccountContext } from '../../ContextProvider';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import useUndoableState from "../../modules/useUndoableState";

import { onKeyboardEvent } from "../../modules/onKeyboardEvent";    //단축키 감지

function MainNote({ onRequestedHelp, changedContentInfo }) {    
    const [changedContent, setChangedContent] = useState("");
    const { state: {answerState}, actions:{setAnswerState} } = useContext(AnswerStateContext);
    const { state: {memberAccount}, actions:{setMemberAccount} } = useContext(MemberAccountContext);


    //작은 버튼 표시 여부
    const [isDraggedButtonOn, setIsDraggedButtonOn] = useState(false);
    const [isCursorButtonOn, setIsCursorButtonOn] = useState(false);
    
    //IMG
    const copyImgUrl = process.env.PUBLIC_URL + "/images/copy.png";
    const shareImgUrl = process.env.PUBLIC_URL + "/images/share.png";
    const backWhiteImgUrl = process.env.PUBLIC_URL + "/images/go_back_white.png";
    const forwardWhiteImgUrl = process.env.PUBLIC_URL + "/images/go_forward_white.png";
    const backBlackImgUrl = process.env.PUBLIC_URL + "/images/go_back_black.png";
    const forwardBlackImgUrl = process.env.PUBLIC_URL + "/images/go_forward_black.png";
    // const pencilBlackImg = process.env.PUBLIC_URL + "/images/pencil_black.png";
    const pencilBlueImg = process.env.PUBLIC_URL + "/images/pencil_blue.png";
    const pencilGreenImg = process.env.PUBLIC_URL + "/images/pencil_green.png";

    const [content, setContent] = useState("");
    const contentRef = useRef();


    




    //기본 내용으로 돌아가기
    useEffect(() => {
        // 기본 텍스트를 설정합니다.
        if (content !== "" && changedContent === "" && contentRef.current) {
            contentRef.current.innerText = content;
        }
    }, [changedContent]);

    // 띄어쓰기 계산
    const [wholeTextCountWithoutSpace, setWholeTextCountWithoutSpace] = useState(0);
    const [wholeTextCountWithSpace, setWholeTextCountWithSpace] = useState(0);
    useEffect(() => {
        if (content.length === 0 || content === `\n`) {
            setWholeTextCountWithoutSpace(0);
            setWholeTextCountWithSpace(0);
        } else {
            setWholeTextCountWithoutSpace(content.replace(/(\s*)/g, "").length);
            setWholeTextCountWithSpace(content.replace(/(\n*)/g, "").length);
        }
    }, [content]);

    //문자열 바꾸라고 하면 내용 바꾸기
    useEffect(() => {
        const [_requestMsg, isApply,changingTxt,_content,selectedIdx] = changedContentInfo;
        if (_requestMsg === "") {return;}
        if (_requestMsg === "draggedText") {
            if (changingTxt === "") {       //기존 내용으로 돌아와야 할 경우
                setChangedContent("");
                return;
            }
            if (isApply) {
                // 메모장에 실제 적용하기 (ai 단어 클릭한 경우)
                const leftTxt = _content.slice(0,selectedIdx[0]);
                const rightTxt = _content.slice(selectedIdx[1], );
                const resultTxt = `${leftTxt} ${changingTxt} ${rightTxt}`;
                setContent(resultTxt);
                setChangedContent("");

                setDoc({text: resultTxt});
            } else {
                // ai 단어 단순 드래그한 경우
                const leftTxt = _content.slice(0,selectedIdx[0]);
                const rightTxt = _content.slice(selectedIdx[1], );
                setChangedContent(`${leftTxt} ${changingTxt} ${rightTxt}`);
            }
        } else if (_requestMsg === "afterSentence") {
            if (changingTxt === "") {       //기존 내용으로 돌아와야 할 경우
                setChangedContent("");
                return;
            }
            const leftTxt = _content.slice(0,selectedIdx);
            const rightTxt = _content.slice(selectedIdx, );
            const resultTxt = `${leftTxt} ${changingTxt} ${rightTxt}`
            if (isApply) {
                // 메모장에 실제 적용하기 (ai 단어 클릭한 경우)
                setContent(resultTxt);
                setChangedContent("");
                setDoc({text: resultTxt});
            } else {
                // ai 단어 단순 드래그한 경우
                setChangedContent(resultTxt);
            }
        }
    }, [changedContentInfo]);

    //ai 요청, 패널 열라고 하기
    const requestedHelp = (requestMsg, param) => {
        //현재 패널 열려있으면 고정, 아니면 이동
        if (requestMsg === "draggedText") {
            onRequestedHelp([requestMsg, content, param]);
        } else if (requestMsg === "afterSentence") {
            onRequestedHelp([requestMsg, content, param])
        }
        
        setIsDraggedButtonOn(false);
        setIsCursorButtonOn(false)
    };

    //타자칠때
    const [cursorButtonPosition, setCursorButtonPosition] = useState({ top: 0, left: 0 });
    const onInput = (event) => {
        // console.log("event.target.innerText", event.target.innerText);
        // if (event.nativeEvent.isComposing) {
            // 자음과 모음 입력시 두 번 입력되는 오류 해결하기 위함
            //isComposing 상태가 true인 경우, 이벤트를 무시
            // console.log("isComposing 무시");
            // return;
        // }
        setContent(contentRef.current.innerText);
        setDoc({text: event.target.innerText});
        setIsCursorButtonOn(true);
        relocateCursorButton(window.getSelection());

        
        if (content.length < 10) {
            {return;}
        }
    };

    //드래그한 문자의 index 찾기
    const findDraggedIdx = (selection) => {         // 선택된 단어의 시작 인덱스 찾기
        const range = selection.getRangeAt(0);
        
        const lastText = range.startContainer.nodeValue; // 마지막 문장
        const selectedText = findDraggedText(selection);            //ai 추천단어
        const firstSentenceLastIdx = content.indexOf(lastText); //마지막 문장 이전 문장의 마지막 인덱스
        const startIndex = firstSentenceLastIdx + lastText.indexOf(selectedText, range.startOffset);        //이전문장까지의 인덱스 + 단어가 들어간 문장 기준 단어의 인덱스
        const endIndex = startIndex + selectedText.length;      //끝 인덱스

        return [startIndex, endIndex];
    }
    
    //드래그한 문자 찾기
    const findDraggedText = (selection) => {                
         return selection.toString().trim();      
    };    

    // //클릭한 부분 문장의 인덱스 찾기
    // const findSelectedIdx = (selection) => {
    //     const range = selection.getRangeAt(0);
    //     const textNode = range.startContainer; // 선택한 텍스트의 시작 노드
    //     const text = textNode.nodeValue; // 텍스트 노드의 값
    //     return range.startOffset;
    //     // console.log(text.indexOf(selectedText, range.startOffset));
    // }
    
    //ai 분석 가능한 문자인지 확인
    const isValidSelectedText = (selection) => {
        if (selection.rangeCount > 0) {
            const selectedText = findDraggedText(selection);
            let withoutspace = selectedText.replace(/\s+/g, '');       
            if (selectedText.length <= 0 || withoutspace.length <= 1) {
                return false;
            }
            return true;
        }

    }

    //단어 ai 요청 버튼 위치 세팅
    const relocateDraggedButton = (selection) => {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // 버튼의 위치 설정 (textarea 안에서)
        setDraggedButtonPosition({
            top: rect.bottom + window.scrollY, // 선택한 텍스트의 아래쪽
            left: rect.right + window.scrollX // 선택한 텍스트의 오른쪽
        });
    }

    //끝문장 요청 버튼 위치 세팅
    const relocateCursorButton = (selection) => {
        const range = selection.getRangeAt(0);
        const cursorIdx = range.endOffset; // 선택한 텍스트의 시작 노드
        const rect = range.getBoundingClientRect();

        console.log(rect.bottom + window.scrollY);
        console.log(rect.right + window.scrollX);

        // 버튼의 위치 설정 (textarea 안에서)
        setCursorButtonPosition({
            top: rect.bottom + window.scrollY, // 선택한 텍스트의 아래쪽
            left: rect.right + window.scrollX // 선택한 텍스트의 오른쪽
        });
    }

    const [draggedButtonPosition, setDraggedButtonPosition] = useState({ top: 0, left: 0 });
    // 드래그된 텍스트를 감지하여 버튼 세팅
    const onMoveCurosr = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const cursorEndOffset = range.endOffset; // 선택한 텍스트의 시작 노드
        const cursorStartOffset = range.startOffset; // 선택한 텍스트의 시작 노드
        const dragCount = cursorEndOffset - cursorStartOffset;
        if (cursorEndOffset <= 0) {               //처음 노트 클릭시 버튼 미생성
            setIsCursorButtonOn(false);
            setIsDraggedButtonOn(false);
        } else {
            if ( dragCount > 0) {
                //드래그 한 경우
                //커서버튼 지우기
                setIsCursorButtonOn(false);
                if (isValidSelectedText(selection)) {
                    //2글자 이상인 경우
                    //드래그버튼 생성
                    relocateDraggedButton(selection);
                    setIsDraggedButtonOn(true);
                } else {
                    //3글자 이하인 경우
                    //드래그버튼 지우기
                    setIsDraggedButtonOn(false);
                }
            } else {
                //드래그 안한 경우
                //커서버튼 생성
                setIsDraggedButtonOn(false);
                relocateCursorButton(selection);
                setIsCursorButtonOn(true);
            }
        }
    };

    //단어 ai 버튼 클릭시
    const onDraggedButtonClick = () => {
        const selection = window.getSelection();
        const selectedIdx = findDraggedIdx(selection);

        requestedHelp("draggedText", selectedIdx);
        setIsDraggedButtonOn(false);
    };
    
    const onCursorButtonClick = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        const currentNodeText = range.startContainer.nodeValue; // 현재 클릭한 부분의 문장
        const cursorIdxInCurrentNode = range.startOffset; // 선택한 텍스트의 시작 노드
        const currentNodeLastIdx = content.indexOf(currentNodeText);    // 현재 클릭한 부분 문장의 마지막 인덱스

        const cursorIdx = cursorIdxInCurrentNode + currentNodeLastIdx;
        requestedHelp("afterSentence", cursorIdx);
        setIsCursorButtonOn(false);
    }


    const onClickCopyButton = async (event) => {
        try {
            hideTooltip(event);
            await navigator.clipboard.writeText(content);
            // alert('클립보드에 링크가 복사되었습니다.');
            toast.success("복사 완료", {
                position: "top-center",     //위치
                autoClose: 700,        //소요시간
                closeButton: false,     //닫기버튼 생성
                progress: false,        //
                // transition: 'flip',
            });
        } catch (e) {
            // alert('복사에 실패하였습니다. 다시 시도해주세요.');
            toast.warn("복사 실패. 다시 시도해주세요.", {
                position: "top-center",     //위치
                autoClose: 1000,        //소요시간
                // closeButton: false,     //닫기버튼 생성
                progress: false,        //
                // transition: 'flip',
            });
        }
    };
    

    const onClickShareButton = (event) => {
        hideTooltip(event);
    }
    
    const hideTooltip = (event) => {
        const classList = event.currentTarget.classList;
        if (!classList.contains('clicked')){
            classList.toggle('clicked');
        }
    }
    
    
    
    
    //------------undo, redo 기능 만들기 위한 설정---------------//
    const {
        state: doc,
        setState: setDoc,
        resetState: resetDoc,
        index: docStateIndex,
        lastIndex: docStateLastIndex,
        goBack: undoDoc,
        goForward: redoDoc
    } = useUndoableState(
        { text: "" }, // initial value
        500 // debounce timeout before states gets updated (optional - defaults to 500)
    );

    const canUndo = docStateIndex > 0;
    const canRedo = docStateIndex < docStateLastIndex;

    
    //-------------------------//


    //=========== undo/redo 관련  ===============//
    
    const onClickUndoButton = (event) => {
        if (event){
            //단축키가 아닌 클릭시에만 동작하도록
            hideTooltip(event);     
        }
        const undoText = undoDoc();
        console.log("==============undo=============");
        console.log("index");
        console.log(docStateIndex);
        console.log("doc");
        console.log(doc);
        console.log("doc.text");
        console.log(doc.text);
        console.log("===========================");
        contentRef.current.innerText = undoText;
        setIsCursorButtonOn(false);
        setIsDraggedButtonOn(false);
    }


    const onClickRedoButton = (event) => {
        hideTooltip(event);
        const redoText = redoDoc();
        
        console.log("===========redo==============")
        console.log("index");
        console.log(docStateIndex);
        console.log("doc")
        console.log(doc)
        console.log("doc.text")
        console.log(doc.text)
        console.log("===========================")
        contentRef.current.innerText = redoText;
        setIsCursorButtonOn(false);
        setIsDraggedButtonOn(false);
    }
    //======================================================//




    return (
            // <div className="mn-sub-container">
            <>
                <header className="mn-header">
                    <div className="mn-sub-header1">
                        <button className="mn-back-button" onClick={onClickUndoButton} disabled={!canUndo} tooltip="되돌리기(ctrl+z)" flow="up">
                            {canUndo ? 
                                <img src={backBlackImgUrl} className="mn-back-black-img"/>
                                :
                                <img src={backWhiteImgUrl} className="mn-back-white-img"/>
                            }
                        </button>
                        <button className="mn-forward-button" onClick={onClickRedoButton} disabled={!canRedo} tooltip="다시 실행" flow="up">
                            {canRedo ? 
                                <img src={forwardBlackImgUrl} className="mn-forward-black-img"/>
                                :
                                <img src={forwardWhiteImgUrl} className="mn-forward-white-img"/>
                            }
                        </button>
                        <button className="mn-copy-button" onClick={onClickCopyButton} tooltip="복사하기" flow="up">
                            <img src={copyImgUrl} className="mn-copy-img"/>
                        </button>
                        <div className="mn-tokenSum" tooltip="ai 요청 가능 횟수" flow="up">{memberAccount.tokenSum ? memberAccount.tokenSum : 0} 토큰</div>
                        {memberAccount.tokenSum != "0" ? 
                            null
                        :
                            <div className="mn-tokenSum-nextTokenRefreshTime">{memberAccount.nextTokenRefreshTime ? memberAccount.nextTokenRefreshTime : "00:00"} 이후 토큰 충전됨</div>
                        }
                        {/* <button className="mn-share-button" onClick={onClickShareButton} tooltip="공유하기" flow="up"> */}
                            {/* <img src={shareImgUrl} className="mn-share-img"/> */}
                        {/* </button> */}
                    </div>
                    <div className="mn-sub-header2">
                        {/* <button className="mn-local-save-button" onClick={localSaveContent}>임시저장</button> */}
                        {/* <div>{isSaved ? `자동 저장됨`: ``}</div> */}
                    </div>
                </header>
                {changedContent ? 
                    <div                                     
                    className="mn-textarea" 
                    value={changedContent}
                    type="text" 
                    >{changedContent}</div>
                : 
                    <div 
                        ref={contentRef}
                        contentEditable
                        className="mn-textarea" 
                        // value={content}
                        onInput={onInput} 
                        onMouseUp={onMoveCurosr} 
                        onKeyUp={onMoveCurosr}
                        onKeyDown={onKeyboardEvent(onClickUndoButton)}
                        type="text"
                        placeholder='Write your content..' 
                        suppressContentEditableWarning={true}
                    >
                    </div>
                }
                {isDraggedButtonOn ? 
                    <button 
                        className="mn-help-dragged-button" 
                        style={{
                            top: draggedButtonPosition.top, 
                            left: draggedButtonPosition.left,
                        }}
                        onClick={onDraggedButtonClick}>
                            <img src={pencilBlueImg} className="mn-pencil-blue-img"/>
                    </button> : null
                }
                
                {isCursorButtonOn ? 
                    <button 
                        className="mn-help-cursor-button" 
                        style={{
                            top: cursorButtonPosition.top, 
                            left: cursorButtonPosition.left,
                        }}
                        onClick={onCursorButtonClick}
                        >
                            <img src={pencilGreenImg} className="mn-pencil-green-img"/>
                    </button> : null
                }
                <div className="mn-bottom-container">
                    <div className="mn-count-wholeText"> {wholeTextCountWithSpace}글자 (공백 제외 {wholeTextCountWithoutSpace}글자)</div>    
                </div>
        </>
            // </div>
    );
    



    
}


export default MainNote;





