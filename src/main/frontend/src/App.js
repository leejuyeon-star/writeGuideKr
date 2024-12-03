//React Router v6.4 이상 버전
/* 
<useBlocker를 사용하려면 creacteBrowserRouter를 사용해야 함>

Router에서 useBlocker가 데이터 라우터(Data Router) 환경에서만 작동하도록 설계되었기 때문입니다. 
데이터 라우터는 React Router v6.4 이상에서 도입된 기능으로, 
createBrowserRouter와 같은 API를 통해 설정됩니다.

createBrowserRouter는 React Router v6.4 이상에서 
데이터 라우터를 사용하여 앱을 구성하는 방식입니다. 
현재 코드에서 사용하는 BrowserRouter와 Routes는 표준 라우팅 방식으로, 
데이터 라우터의 동작을 대체할 수 있습니다. 하지만 데이터 라우터로 전환하려면
 createBrowserRouter와 RouterProvider를 활용해야 합니다.
아래는 기존 BrowserRouter 기반 코드를 createBrowserRouter를 사용하는 방식으로 변환한 예입니다.
*/


import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import Login from "./pages/Login";
import About from "./pages/About";
import { ToastContainer } from 'react-toastify';
import { ContextProvider } from './ContextProvider';
import "./styles/tooltip.css";
import Privacy from "./pages/Privacy";
import MasterHeader from './components/MasterHeader';
import MasterFooter from './components/MasterFooter';
import Account from './pages/Account';
import NetworkError from './pages/NetworkError';

// 데이터 라우터 정의
const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <>
      <MasterHeader />
      <Home />
      {/* MasterFooter는 MainPannel에 포함됨 */}
    </>,
  },
  {
    path: "/login-page",
    element: <Login />,
  },
  {
    path: "/about",
    element:     
    <>
      <MasterHeader />
      <About />
      <MasterFooter />
    </>,
  },
  {
    path: "/privacy",
    element: 
    <>
      <MasterHeader />
      <Privacy />
      <MasterFooter />
    </>,
  },
  {
    path: "/account",
    element: 
    <>
      <MasterHeader />
      <Account />
      <MasterFooter />
    </>,
  },
  {
    path: "/network-error",
    element: 
    <>
      <MasterHeader />
      <NetworkError />
      <MasterFooter />
    </>,
  },
]);

function App() {
  return (
    <ContextProvider>
      <div className="App">
        <ToastContainer />
        {/* 데이터 라우터를 사용하는 RouterProvider */}
        <RouterProvider router={router} />
      </div>
    </ContextProvider>
  );
}

export default App;








// React Router v6.4 이하 버전
//// import './App.css';
// import {                                                         
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
// } from "react-router-dom";
// import Home from './pages/Home';
// import { ToastContainer, toast } from 'react-toastify' 
// import { ContextProvider } from './ContextProvider';
// import "./styles/tooltip.css"
// import Login from "./pages/Login";
// import About from "./pages/About";


// function App() {
//   return (
//     <ContextProvider>
//     <div className="App">
//       <ToastContainer /> 
//       <Router>
//         <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login-page" element={<Login />} />
//             <Route path="/about" element={<About />} />
//         </Routes>
//       </Router>
//     </div>
//     </ContextProvider>
//   );
// }

// export default App;















