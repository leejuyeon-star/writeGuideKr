import { useState, useEffect, delay, useContext } from "react";
import { useNavigate } from "react-router-dom"
import React from "react";
import '../styles/Account.css'
import { GetMemberAccount, Logout } from "../api/auth";     
import { DeleteMember } from "../api/auth"
import { useBlocker } from "react-router-dom";

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
            const _memberAccount = await GetMemberAccount();     //토큰 총 수 가져오기
            if (_memberAccount === "NETWORK_ERROR") {
                navigate("/network-error")
                return;
            }
            if (_memberAccount.userName === "NON_MEMBER") {
                navigate('/login-page');
                return;
            }
            setUserName(_memberAccount.userName);
            setTokenSum(_memberAccount.tokenSum);
            setNextTokenRefreshTime(_memberAccount.nextTokenRefreshTime);
            setProvider(_memberAccount.provider);
        }
        a();
    }, []);



    // =====라우터를 통한 이동시 알림창 띄우기 =====//
    const blocker = useBlocker(({ currentLocation, nextLocation }) => {
            return currentLocation.pathname !== nextLocation.pathname;
        //  return when && currentLocation.pathname !== nextLocation.pathname
        }
    );

    useEffect(() => {
        if (blocker.state !== "blocked") return;
        if (window.confirm(`사이트를 벗어나시겠습니까? \n변경사항이 저장되지 않을 수 있습니다.`)) {
            blocker.proceed();
        } else {
            blocker.reset();
        }
    }, [blocker.state]);

    // ===========================================//

    const onClickDeleteAccount = async () => {
        if(window.confirm("정말 탈퇴하시겠습니까? 관련 데이터가 모두 사라집니다.")) {
            //확인
            const response = await DeleteMember();
            if (response === "NETWORK_ERROR") {
                navigate("/network-error");
                return;
            }
            if (response === "NON_MEMBER") {
                navigate("/login-page");
                return;
            }
            await Logout();
            navigate("/login-page");
            return;    
        }
        else {
            //취소
        }
    

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
