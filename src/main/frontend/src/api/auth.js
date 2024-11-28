import { useEffect, useState } from "react";
import axios from 'axios';
import { ResponseGet } from "./callBackend";


//회원/게스트 여부 확인 후 회원인 경우 response값 리턴, 게스트인 경우 null 값 리턴
export const GetMemberInfo = async (path, param={}) => {
    const [isSuccess, response] = await ResponseGet(path, param);    
    if (!isSuccess) {
        //네트워크 오류인 경우
        // setTokenSum(0);
        // setIsMember(false);
        localStorage.setItem("isMember", false);
        return null;
    } else if (response === "non-member") {
        //게스트인 경우
        console.log("비회원인 경우");
        localStorage.setItem("isMember", false);
        // setTokenSum(0);
        // setIsMember(false);
        return null;
    }
    else {
        //회원인 경우
        localStorage.setItem("isMember", true);
        return response;
        // setTokenSum(parseInt(response));
        // setIsMember(true);
    }

}



// export const GetTokenSum = async () => {
//     // export const CallBetweenPhrase = async ([txt, idx]) => {
//         async function getResponseGet() {
//             try{
//                 // console.log("jsonRequestMsg");
//                 // console.log(jsonRequestMsg);
//                 const response = await axios.get('/token-sum',
//                     { "Content-Type": "application/json", withCredentials: true },  //withCredentials: true: 브라우저에서 세션 쿠키(JSESSIONID)를 함께 전송
//                     // {
//                     //     params: {
//                     //         data: "nickname"
//                     //     },
//                     // },
//                 );
//                     console.log("response.data:");
//                     console.log(response.data);
//                     return [true, response.data];
//             } catch (error) {
//                 // console.log("jsonRequestMsg:");
//                 // console.log(jsonRequestMsg);
//                 console.log("error:");
//                 console.log(error);
//                 return [false, error];
//             }     
//         }
    
//         return getResponseGet();
    
//     }