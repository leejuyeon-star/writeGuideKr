import { useEffect, useState } from "react";
import axios from 'axios';
import { ResponseDelete, ResponseGet, ResponsePost } from "./callBackend";


//회원/게스트 여부 확인 후 회원인 경우 response값 리턴, 게스트인 경우 null 값 리턴
//네트워크 에러인 경우 네트워크 에러 페이지로 이동
export const GetMemberAccount = async () => {
    const [isSuccess, response] = await ResponseGet("/member-account");
    if (!isSuccess) {
        //네트워크 오류인 경우
        return "NETWORK_ERROR";
    }
    
        //회원인 경우
        console.log(response);
        const userName = response.userName;
        const tokenSum = response.tokenSum;
        const nextTokenRefreshTime = response.nextTokenRefreshTime;
        const provider = response.provider;

        localStorage.setItem("userName", userName);

        return response;

}





//회원 탈퇴
export const DeleteMember = async () => {
    const [isSuccess, response] = await ResponseDelete("/member");
    if (!isSuccess) {
        //네트워크 오류인 경우
        return "NETWORK_ERROR";
    }
    if (response === "NON_MEMBER") {
        return "NON_MEMBER";
    }
    if (response === "success") {
        return null;
    }
    
}

//로그아웃
export const Logout = async () => {
    const a = await axios.post('/logout', 
            { "Content-Type": "application/json", withCredentials: true }   //withCredentials: true: 브라우저에서 세션 쿠키(JSESSIONID)를 함께 전송
    );
    window.location.href = '/login-page';  // 해당 URL로 리다이렉트. 백엔드 서버에서도 리다이렉트하지만 무슨 이윤지 몰라도 프론트에서도 리다이렉트해줘야함
}

