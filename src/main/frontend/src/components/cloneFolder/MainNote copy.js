// import PropTypes from "prop-types";
// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import '../styles/MainNote.css'
// import { Transition } from 'react-transition-group';


// function MainNote({ onRightPannelVisible, onRequestedHelp, changedContentInfo}) {
//     const [content, setContent] = useState("");
//     const [isReady, setIsReady] = useState(false);
//     const [changedContent, setChangedContent] = useState("");
//     // const [selectedText, setSelectedText] = useState("");
//     // const [selectedIdx, setSelectedIdx] = useState([0,0]);
//     const [isRightPannelVisible, setIsRightPannelVisible] = useState(false);
//     const [isDraggedButtonOn, setIsDraggedButtonOn] = useState(false);
//     const contentRef = useRef(null);





//     //기본 내용으로 돌아가기
//     useEffect(() => {
//         // 기본 텍스트를 설정합니다.
//         if (changedContent === "" && contentRef.current) {
//             contentRef.current.innerText = content;
//         }
//     }, [changedContent]);

//     //문자열 바꾸라고 하면 내용 바꾸기
//     useEffect(() => {
//         const [_requestMsg, isApply,changingTxt,_content,selectedIdx] = changedContentInfo;
//         if (_requestMsg === "") {return;}
//         if (_requestMsg === "selectedText") {
//             if (changingTxt === "") {       //기존 내용으로 돌아와야 할 경우
//                 setChangedContent("");
//                 return;
//             }
//             if (isApply) {
//                 console.log("진짜바꾸기");
//                 const leftTxt = _content.slice(0,selectedIdx[0]);
//                 const rightTxt = _content.slice(selectedIdx[1], );
//                 setContent(`${leftTxt} ${changingTxt} ${rightTxt}`);
//                 setChangedContent("");
//             } else {
//                 const leftTxt = _content.slice(0,selectedIdx[0]);
//                 const rightTxt = _content.slice(selectedIdx[1], );
//                 console.log(`${leftTxt} ${changingTxt} ${rightTxt}`);
//                 setChangedContent(`${leftTxt} ${changingTxt} ${rightTxt}`);
//             }
//         }
//     }, [changedContentInfo]);

//     //ai 요청, 패널 열라고 하기
//     const requestedHelp = (requestMsg, _selectedIdx) => {
//         //현재 패널 열려있으면 고정, 아니면 이동
//         onRequestedHelp([requestMsg, content, _selectedIdx]);
//         if (!isRightPannelVisible){
//             onRightPannelVisible(true);
//             setIsRightPannelVisible(true);
//         }
//         setIsDraggedButtonOn(false);

//     };

//     //타자칠때
//     const onInput = () => {
//         setContent(contentRef.current.innerText);
//         // setContent(event.target.innerText);
//         if (content.length < 10) 
//             {return;}
//         else {
//             if (!isReady) {
//                 // console.log(content.length)
//                 setIsReady(true);
//             }
//         }
//     };

//     //드래그한 문자의 index 찾기
//     const findSelectedIdx = (selection) => {         // 선택된 단어의 시작 인덱스 찾기
//         const range = selection.getRangeAt(0);
//         const textNode = range.startContainer; // 선택한 텍스트의 시작 노드
//         const text = textNode.nodeValue; // 텍스트 노드의 값
//         const selectedText = findSelectedText(selection);
//             const startIndex = text.indexOf(selectedText, range.startOffset);
//             const endIndex = startIndex + selectedText.length;

//             // setSelectedWordInfo(`선택된 단어: "${selectedText}", 시작 인덱스: ${startIndex}, 끝 인덱스: ${endIndex}`);
//         return [startIndex, endIndex];
//     }


    
//     //드래그한 문자 찾기
//     const findSelectedText = (selection) => {                
//          return selection.toString().trim();       //.trim()붙여도돼?
//     };    
    
//     //ai 분석 가능한 문자인지 확인
//     const isValidSelectedText = (selection) => {
//         if (selection.rangeCount > 0) {
//             const selectedText = findSelectedText(selection);
//             let withoutspace = selectedText.replace(/\s+/g, '');       
//             if (selection.length <= 0 || withoutspace.length <= 2) {
//                 // setSelectedText('');
//                 return false;
//             }
//             return true;
//         }

//     }

//     //단어 ai 요청 버튼 위치 세팅
//     const relocateDraggedButton = (selection) => {
//         const range = selection.getRangeAt(0);
//         const rect = range.getBoundingClientRect();

//         // 버튼의 위치 설정 (textarea 안에서)
//         setButtonPosition({
//             top: rect.bottom + window.scrollY, // 선택한 텍스트의 아래쪽
//             left: rect.right + window.scrollX // 선택한 텍스트의 오른쪽
//         });
//     }

//     const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
//     // 드래그된 텍스트를 감지하여 버튼 세팅
//     const onMouseUp = () => {
//         const selection = window.getSelection();
//         if (isValidSelectedText(selection)) {
//             relocateDraggedButton(selection)        //버튼 재배치
//             setIsDraggedButtonOn(true);             
//         } else {
//             // setSelectedText(''); // 선택된 텍스트가 없으면 초기화
//             setIsDraggedButtonOn(false);
//         }
//     };

//     //단어 ai 버튼 클릭시
//     const onDraggedButtonClick =() => {
//         const selection = window.getSelection();
//         const selectedIdx = findSelectedIdx(selection);

//         requestedHelp("selectedText", selectedIdx);
//         setIsDraggedButtonOn(false);
//     };
        
//     MainNote.propTypes = {
//         // onRequestedHelp: PropTypes.array,
//     };

    
    
//     const defaultStyle = {
//         transition: `width 700ms ease-out`,
//     };

//     const transitionStyles = {
//         entering: { width: `100vw` },
//         entered: { width: `66vw` },
//         exiting: { width: `66vw` },
//         exited: { width: `100vw` },  
//     };

//         return (
//             <>
//             <Transition in={isRightPannelVisible} timeout={700}>
//                 {(state) => (
//                 <div
//                     style={{
//                     ...defaultStyle,
//                     ...transitionStyles[state]
//                     }}
//                 >
//                     <div className="main-note-container">
//                         <div className="mn-sub-container">
//                             <header>
//                                 <h2>글쓰기</h2>
//                             </header>
//                             {changedContent ? 
//                              <div                                     
//                                 className="mn-textarea" 
//                                 value={changedContent}
//                                 type="text" 
//                             >{changedContent}</div>
//                             : 
//                                 <div 
//                                     ref={contentRef}
//                                     contentEditable
//                                     className="mn-textarea" 
//                                     // value={content}
//                                     onInput={onInput} 
//                                     onMouseUp={onMouseUp} 
//                                     type="text" 
//                                     placeholder='Write your content..' 
//                                     suppressContentEditableWarning={true}
//                                 > 
//                                     {isDraggedButtonOn ? 
//                                         <button 
//                                             className="mn-help-dragged-button" 
//                                             style={{
//                                                 top: buttonPosition.top, 
//                                                 left: buttonPosition.left,
//                                             }}
//                                             onClick={onDraggedButtonClick}>
//                                         </button> : null}
//                                 </div>
//                             }

//                         </div>
//                     </div>
//                 </div>
//                 )}
//             </Transition>
//         </>
//         );
    



    
// }


// export default MainNote;

