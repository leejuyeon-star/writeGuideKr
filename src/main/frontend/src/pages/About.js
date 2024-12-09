import { useState, useEffect, useRef, delay, useContext } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

function About() {

    let [value, setValue] = React.useState("");

    // Block navigating elsewhere when data has been entered into the input
    // let blocker = useBlocker(
    //   ({ currentLocation, nextLocation }) =>
    //     value !== "" &&
    //     currentLocation.pathname !== nextLocation.pathname
    // );


    const contentRef = useRef();
    

    useEffect(() => {

        contentRef.current.focus();
        contentRef.current.innerText = 
        ` 글쓰기 ai 도우미 '글잇다'입니다. 다음 녹색 버튼을 클릭
        
        
         ai 분석을 통해 문맥에 알맞는 표현을 추천해 드립니다. (<- '알맞는'을 드래그해보세요.)
        
        
        
         지금 바로 로그인하여 다양한 주제로 글을 써보세요.`;
         console.log(contentRef.current.innerText);
         

         
         
         
         
         //! 커서 노트 클릭



         
        //커서 버튼 활성화
        // onMoveCurosr();
    }, [])







    return (
        // <div>글잇다란?</div>

        <div 
        ref={contentRef}
        contentEditable
        // className="mn-textarea" 
        // value={content}
        // onInput={onInput} 
        // onMouseUp={onMoveCurosr} 
        // onKeyUp={onMoveCurosr}
        // onKeyDown={onKeyboardEvent(onClickUndoButton)}
        type="text"
        // placeholder='Write your content..' 
        suppressContentEditableWarning={true}
        >
        </div>

        // <Form method="post">
        // <>
        // <label>
        //   Enter some important data:
        //   <input
        //     name="data"
        //     value={value}
        //     onChange={(e) => setValue(e.target.value)}
        //   />
        // </label>
        // <button type="submit">Save</button>
  
        // {blocker.state === "blocked" ? (
        //   <div>
        //     <p>Are you sure you want to leave?</p>
        //     <button onClick={() => blocker.proceed()}>
        //       Proceed
        //     </button>
        //     <button onClick={() => blocker.reset()}>
        //       Cancel
        //     </button>
        //   </div>
        // ) : null}
        // </>
    //   </Form>
    );
}


export default About;
