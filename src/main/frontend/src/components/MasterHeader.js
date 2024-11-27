import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import { UNSAFE_getSingleFetchDataStrategy, useParams } from "react-router-dom";
import '../styles/MasterHeader.css'
import { Transition } from 'react-transition-group';
import { Link } from "react-router-dom";
import axios from 'axios';
import { CallMemberInfo } from "../api/auth";

function MasterHeader() {
    const [nickname, setNickname] = useState("");

    //닉네임 보이기
    // useEffect( async () => {
    //     const _nickname =  localStorage.getItem("nickname");

    //     if (_nickname){
    //         //로그인 되어있는 경우
    //         setNickname(_nickname);
    //     } else {
    //         // 이전에 게스트였던 경우 아직도 게스트인지 다시한번 확인
    //         const [isSuccess, nickname] = await CallMemberInfo();
    //         if (!isSuccess || nickname === "") {
    //             //로그인 오류 or 게스트인 경우
    //             setNickname("");
    //             localStorage.setItem("nickname", "");
    //         } else {
    //             //회원인 경우
    //             setNickname(nickname)
    //             localStorage.setItem("nickname", nickname);
    //         }
    //     }
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
        console.log(a.data);
        window.location.href = '/login-page';  // 해당 URL로 리다이렉트. 백엔드 서버에서도 리다이렉트하지만 무슨 이윤지 몰라도 프론트에서도 리다이렉트해줘야함
    }

    const onClickIntroduceButton = () => {
        console.log("글잇다 소개 버튼 클릭");
    }


    return (
        <div className="mh-container">
            <h1 button className="mh-title-button">글잇다</h1>
            <Link to="/about"  style={{ textDecoration: "none", color: "black"}}>
                <button className="mh-introduce-button" onClick={onClickIntroduceButton}>글잇다 소개</button>
            </Link>
            {/* {nickname ?  */}
                    <div>
                    <div>{nickname}님</div>
                    <button onClick={onLogout}>로그아웃</button>
                    </div>
            {/* : */}
                <Link to="/login-page"  style={{ textDecoration: "none", color: "black"}}>
                    <button>로그인</button>
                </Link>
            {/* } */}
        </div>
    );
}

export default MasterHeader;
