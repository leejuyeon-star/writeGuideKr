import { useEffect, useState } from "react";
import axios from 'axios';
import { ResponseGet } from "./callBackend";


//회원/게스트 여부 확인 후 회원인 경우 response값 리턴, 게스트인 경우 null 값 리턴
export const GetMemberAccount = async () => {
    const [isSuccess, response] = await ResponseGet("/account");
    if (!isSuccess) {
        //네트워크 오류인 경우
        // setTokenSum(0);
        // setIsMember(false);
        localStorage.setItem("userName", "");
        return null;
    } 
    
    if (response.userName === "") {
        //게스트인 경우
        console.log("비회원인 경우");
        localStorage.setItem("userName", "");
        // setTokenSum(0);
        // setIsMember(false);
        return null;
    } else {
        //회원인 경우
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
    }


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


