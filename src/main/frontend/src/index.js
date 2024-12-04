import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'


//===================배포시 console.log 출력을 막음===========================
//참고: https://moontomato.tistory.com/30
// if (process.env.NODE_ENV === "production") { // production에서만 사용할 수 없도록
//   console = window.console || {};
//   console.log = function no_console() {}; // console log 막기
//   console.warn = function no_console() {}; // console warning 막기
//   console.error = function () {}; // console error 막기
// }
//===================================================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
