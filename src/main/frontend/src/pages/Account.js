import { useState, useEffect, delay, useContext } from "react";
import React from "react";
import '../styles/Account.css'

function Account() {
    const [name, setName] = useState("이주연");
    const [tokenCount, setTokenCount] = useState(0);

    const onClickDeleteAccount = {
        //진짜 하시겠씁니까?물어보고 한다고 하면 진행하기

    }

    return (
        <div className="account-container">
            <div className="account-displayContant">
                <h1>회원정보</h1>
                <div className="account-contant-section">
                    <h3>이름</h3>
                    <p>{name}</p>
                </div>

                <div className="account-contant-section">
                    <h3>보유 토큰</h3>
                    <p>{tokenCount}토큰</p>
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
