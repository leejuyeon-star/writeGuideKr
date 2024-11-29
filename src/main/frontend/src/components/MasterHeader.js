import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import '../styles/MasterHeader.css'
import { Transition } from 'react-transition-group';
import { Link } from "react-router-dom";
import axios from 'axios';
import { GetMemberAccount } from "../api/auth";
import { sortedUniq } from "lodash";


function MasterHeader() {
    // const navigate = useNavigate(); // useNavigate를 컴포넌트 내부에서 호출
    const [isMember, setIsMember] = useState(false);


    useEffect(() => {
        console.log("갱신", isMember);
    }, [isMember]);

    //회원/게스트 여부 확인
    useEffect(() => {
        async function a() {
            console.log("Home useEffect");
            const memberAccount = await GetMemberAccount();     //토큰 총 수 가져오기
            if (localStorage.getItem("userName") === "") {
                //비회원인 경우
                console.log("MasterHeader 비회원")
                setIsMember(false);

            } else {
                //회원인 경우
                console.log("MasterHeader 회원")
                setIsMember(true);
            }
        }
        a();
    }, []);

    //localStorage로 회원/게스트 여부 확인
    // useEffect(() => {
    //     async function a() {
    //         console.log("MasterHeader useEffect");
    //         const _isMember =  JSON.parse(localStorage.getItem("isMember"));        //회원/게스트 여부 확인, boolean으로 형변환
    //         console.log(_isMember);
    //         console.log(typeof _isMember);
    //         if (_isMember){
    //             //회원
    //             console.log("회원임");
    //             setIsMember(true);
    //         } else {
    //             //게스트
    //             console.log("게스트임");
    //             setIsMember(false);
    //         }
    //     }
    //     a();
    // }, []);


    //다른 탭에서만 작동함
    // //localStorage로 회원/게스트 여부 확인, localStorage가 업데이트되면 호출됨
    // useEffect(() => {
    //     const handleStorageChange = (event) => {
    //       if (event.key === "isMember") {
    //         console.log("localStorage 값이 변경되었습니다:", event.newValue);
    //         setIsMember(JSON.parse(event.newValue));
    //       }
    //     };
    
    //     // storage 이벤트 리스너 등록
    //     window.addEventListener("storage", handleStorageChange);
    
    //     // 컴포넌트 언마운트 시 리스너 제거
    //     return () => {
    //       window.removeEventListener("storage", handleStorageChange);
    //     };
    // }, []);
    


    async function onLogout() {
        // localStorage.setItem("nickname", "");
        // setNickname("");
        await handleLogout();
    }

    async function handleLogout() {
        const a = await axios.post('/logout', 
        // await axios.post('/api/logout', 
            
            { "Content-Type": "application/json", withCredentials: true }   //withCredentials: true: 브라우저에서 세션 쿠키(JSESSIONID)를 함께 전송
        );
        window.location.href = '/login-page';  // 해당 URL로 리다이렉트. 백엔드 서버에서도 리다이렉트하지만 무슨 이윤지 몰라도 프론트에서도 리다이렉트해줘야함
    }




    return (
        <div className="mh-container" style={{zIndex: 100}}>
            <div className="mh-sub-container1"> 
                <Link to="/"  style={{ textDecoration: "none", color: "black"}}>
                    <h1 button className="mh-title-button">글잇다</h1>
                </Link>
                <Link to="/about"  style={{ textDecoration: "none", color: "black"}}>
                    <button className="mh-introduce-button">글잇다 소개</button>
                </Link>
            </div>
            <div className="mh-sub-container2">
                {isMember ? 
                    <div>
                        <Link to="/account"  style={{ textDecoration: "none", color: "black"}}>
                            <button className="mh-account-button">회원정보</button>
                        </Link>
                        <button className="mh-logout-button" onClick={onLogout}>로그아웃</button>
                    </div>
                : 
                    <Link to="/login-page"  style={{ textDecoration: "none", color: "black"}}>
                        <button className="mh-login-button">로그인</button>
                    </Link>
                }
            </div>
        </div>
    );
}

export default MasterHeader;



