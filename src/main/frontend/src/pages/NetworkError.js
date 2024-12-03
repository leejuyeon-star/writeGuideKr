import { useState, useEffect, delay, useContext } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/NetworkError.css'

function NetworkError() {

    // let [value, setValue] = React.useState("");

    return (
        <div className="ne-main-container">
            <div className="ne-sub-container">
                <h1 className="ne-content">404</h1>
                <h4 className="ne-content">페이지를 찾을 수 없습니다.</h4>
        {/* <div>네트워크 연결 에러. 다시 시도해주세요</div> */}
                <p className="ne-content">이 페이지가 계속 나타날 경우 아래 경로로 문의주시기 바랍니다.</p>
                <p className="ne-content">kkobucks@naver.com</p>
            </div>
        </div>
    );
}


export default NetworkError;
