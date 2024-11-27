import { useEffect, useState } from "react";
import axios from 'axios';

export const CallMemberInfo = async () => {
// export const CallBetweenPhrase = async ([txt, idx]) => {
    async function getResponseGet() {
        try{
            // console.log("jsonRequestMsg");
            // console.log(jsonRequestMsg);
            const response = await axios.get('/get-nickname',
                { "Content-Type": "application/json", withCredentials: true },  //withCredentials: true: 브라우저에서 세션 쿠키(JSESSIONID)를 함께 전송
                // {
                //     params: {
                //         data: "nickname"
                //     },
                // },
            );
                console.log("response.data:");
                console.log(response.data);
                return [true, response.data];
        } catch (error) {
            // console.log("jsonRequestMsg:");
            // console.log(jsonRequestMsg);
            console.log("error:");
            console.log(error);
            return [false, error];
        }     
    }

    return getResponseGet();

}