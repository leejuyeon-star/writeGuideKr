//- debounce를 이용하여 타자 치고 몇초뒤 자동 임시저장 시 사용


// 마지막 value가 갱신된 후 {delay}초 후가 되면 한번 호출, 
// 도중에 다시 value값이 갱신되면 delay 초기화 후 기다림
// 참고: https://www.inforum24.com/memos/611

import { useEffect, useState } from 'react';


const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    }; //value 변경 시점에 clearTimeout을 해줘야함.
  }, [value]);

  return debouncedValue;
};

export default useDebounce;




    // //======================타이핑 끝내고 1초후 브라우저에 자동 저장====================//
    // const debouncedSearchText = useDebounce((contentRef.current ? contentRef.current.innerText : ""), 5000);
    // const [isSaved, setIsSaved] = useState(false);
    // useEffect (() => {
    //     if (debouncedSearchText) {return;}
    //     saveContentAtBrowser(debouncedSearchText);
    // }, [debouncedSearchText]);
    
    
    // const saveContentAtBrowser = (debouncedSearchText) => {
    //     localStorage.setItem("guest-NoteContent", `${debouncedSearchText}`);     //객체or배열은 참고 https://yukihirahole.tistory.com/149#%EA%B0%9D%EC%B2%B4%EC%99%80%20%EB%B0%B0%EC%97%B4%20%EC%A0%80%EC%9E%A5%ED%95%98%EB%8A%94%20%EB%B0%A9%EB%B2%95-1
    //     console.log("브라우저에 본문 저장:");
    //     console.log(localStorage.getItem("guest-NoteContent"));
    //     setIsSaved(true);
    // }
    
    // const cleanBrowser = () => {
    //     localStorage.clear();
    // }
    
    // const loadContentFromBrowser = () => {
    //     return localStorage.getItem("guest-NoteContent");
    // }
    // //=========================================================//