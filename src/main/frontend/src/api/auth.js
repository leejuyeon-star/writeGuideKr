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
    
    // if (response.userName === "") {
    //     //게스트인 경우
    //     console.log("비회원인 경우");
    //     localStorage.setItem("userName", "non-member");
    //     // setTokenSum(0);
    //     // setIsMember(false);
    //     navigate("/login-page");
    //     return null;
    // } else {
        //회원인 경우
        console.log(response);
        const userName = response.userName;
        const tokenSum = response.tokenSum;
        const nextTokenRefreshTime = response.nextTokenRefreshTime;
        const provider = response.provider;

        console.log("userName");
        console.log(userName);
        console.log("tokenSum");
        console.log(tokenSum);
        console.log("nextTokenRefreshTime");
        console.log(nextTokenRefreshTime);
        console.log("provider");
        console.log(provider);

        localStorage.setItem("userName", userName);

        return response;
        // setTokenSum(parseInt(response));
        // setIsMember(true);
    // }


    // if (!isSuccess) {
    //     //네트워크 오류인 경우
    //     // setTokenSum(0);
    //     // setIsMember(false);
    //     localStorage.setItem("isMember", false);
    //     return null;
    // } else if (response === "non-member") {
    //     //게스트인 경우
    //     console.log("비회원인 경우");
    //     localStorage.setItem("isMember", false);
    //     // setTokenSum(0);
    //     // setIsMember(false);
    //     return null;
    // }
    // else {
    //     //회원인 경우
    //     localStorage.setItem("isMember", true);
    //     return response;
    //     // setTokenSum(parseInt(response));
    //     // setIsMember(true);
    // }

}





// 탈퇴하기
// 비회원인 경우 userName이 "NON_MEMBER"
// 네트워크 오류인 경우 네트워크 오류 페이지로 이동
// export const DeleteMember = async () => {
    // const [isSuccess, response] = await ResponsePost("/delete-member");
    // if (!isSuccess) {
        //네트워크 오류인 경우
        // return "NETWORK_ERROR";
    // }
    
    // if (response.userName === "NON_MEMBER") {
    //     //게스트인 경우
    //     // console.log("비회원인 경우");
    //     // localStorage.setItem("userName", "non-member");
    //     // setTokenSum(0);
    //     // setIsMember(false);
    //     // return "";
    //     const userName = response.userName;
    //     const tokenSum = 0;
    //     const nextTokenRefreshTime = "00:00";
    //     const provider = "";
    // } else {
    //     //회원인 경우
    //     const userName = response.userName;
    //     const tokenSum = response.tokenSum;
    //     const nextTokenRefreshTime = response.nextTokenRefreshTime;
    //     const provider = response.provider;

    //     // console.log("userName");
    //     // console.log(userName);
    //     // console.log("tokenSum");
    //     // console.log(tokenSum);
    //     // console.log("nextTokenRefreshTime");
    //     // console.log(nextTokenRefreshTime);
    //     // console.log("provider");
    //     // console.log(provider);

    //     // // localStorage.setItem("userName", userName);

    // }
    // return response;


    // if (!isSuccess) {
    //     //네트워크 오류인 경우
    //     // setTokenSum(0);
    //     // setIsMember(false);
    //     localStorage.setItem("isMember", false);
    //     return null;
    // } else if (response === "non-member") {
    //     //게스트인 경우
    //     console.log("비회원인 경우");
    //     localStorage.setItem("isMember", false);
    //     // setTokenSum(0);
    //     // setIsMember(false);
    //     return null;
    // }
    // else {
    //     //회원인 경우
    //     localStorage.setItem("isMember", true);
    //     return response;
    //     // setTokenSum(parseInt(response));
    //     // setIsMember(true);
    // }

// }



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
        // await axios.post('/api/logout', 
            
            { "Content-Type": "application/json", withCredentials: true }   //withCredentials: true: 브라우저에서 세션 쿠키(JSESSIONID)를 함께 전송
    );
    window.location.href = '/login-page';  // 해당 URL로 리다이렉트. 백엔드 서버에서도 리다이렉트하지만 무슨 이윤지 몰라도 프론트에서도 리다이렉트해줘야함
}

