import { useState, useEffect, delay, useContext } from "react";
import {useNavigate } from "react-router-dom"
import React from "react";
import '../styles/Account.css'
import { GetMemberAccount } from "../api/auth";     

function Account() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [tokenSum, setTokenSum] = useState(0);
    const [nextTokenRefreshTime, setNextTokenRefreshTime] = useState("");
    const [provider, setProvider] = useState("")


    //웹갱신시 or api 요청 직후 
    //회원/게스트 여부 확인, token 개수 확인
    useEffect(() => {
        async function a() {
            console.log("Home useEffect");
            const memberAccount = await GetMemberAccount();     //토큰 총 수 가져오기
            if (localStorage.getItem("userName") === "") {
                //비회원인 경우
                navigate('/login-page');
            } else {
                //회원인 경우
                setUserName(memberAccount.userName);
                setTokenSum(memberAccount.tokenSum);
                setNextTokenRefreshTime(memberAccount.nextTokenRefreshTime);
                setProvider(memberAccount.provider);
            }
        }
        a();
    }, []);

    const onClickDeleteAccount = {
        //진짜 하시겠씁니까?물어보고 한다고 하면 진행하기

    }

    return (
        <div className="account-container">
            <div className="account-displayContant">
                <h1>회원정보</h1>
                <div className="account-contant-section">
                    <h3>이름</h3>
                    <p>{userName}</p>
                </div>

                <div className="account-contant-section">
                    <h3>보유 토큰</h3>
                    <p>{tokenSum}토큰</p>
                </div>

                <div className="account-contant-section">
                    <h3>회원 탈퇴</h3>
                    {/* <Link to="/account"  style={{ textDecoration: "none", color: "black"}}> */}
                        <button className="account-delete-account-button" onClick={onClickDeleteAccount}>탈퇴하기</button>
                    {/* </Link> */}
                </div>
            </div>
        </div>

    );
}


export default Account;
