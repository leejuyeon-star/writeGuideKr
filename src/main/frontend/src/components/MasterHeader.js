import PropTypes from "prop-types";
import { useEffect, useState, useRef, useContext } from "react";
import '../styles/MasterHeader.css'
import { Transition } from 'react-transition-group';
import { Link } from "react-router-dom";
import axios from 'axios';
import { GetMemberAccount, Logout } from "../api/auth";
import { sortedUniq } from "lodash";
import { MemberAccountContext } from '../ContextProvider';
import { useNavigate } from "react-router-dom";


function MasterHeader() {
    const navigate = useNavigate(); // useNavigate를 컴포넌트 내부에서 호출
    const [isMember, setIsMember] = useState(false);
    const { state: {memberAccount}, actions:{setMemberAccount} } = useContext(MemberAccountContext);

    useEffect(() => {
        if (memberAccount.userName === "NON_MEMBER") {
            setIsMember(false);
        } else {
            setIsMember(true);
        }
    }, [memberAccount]);

    //회원/게스트 여부 확인
    useEffect(() => {
        async function a() {
            const _memberAccount = await GetMemberAccount();     //토큰 총 수 가져오기
            console.log(_memberAccount)
            if (_memberAccount.userName === "NON_MEMBER") {
                //비회원인 경우
                console.log("MasterHeader 비회원");
                setIsMember(false);
                setMemberAccount(memberAccount);
                return;
                
            } else {
                //회원인 경우
                console.log("MasterHeader 회원");
                setMemberAccount(memberAccount);
                setIsMember(true);
            }
        }
        a();
    }, []);


    


    async function onLogout() {
        await Logout();
    }




    return (
        <div className="mh-container" style={{zIndex: 100}}>
            <div className="mh-sub-container1"> 
                <Link to="/"  style={{ textDecoration: "none", color: "black"}}>
                    <h1 button className="mh-title-button">글잇다</h1>
                </Link>
                {/* <Link to="/about"  style={{ textDecoration: "none", color: "black"}}>
                    <button className="mh-introduce-button">글잇다 소개</button>
                </Link> */}
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



