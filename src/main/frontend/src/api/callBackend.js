import axios from 'axios';

export const ResponseGet = async (path, param = {}) => {
    try{
        const response = await axios.get(path,
            { "Content-Type": "application/json", withCredentials: true },  //withCredentials: true: 브라우저에서 세션 쿠키(JSESSIONID)를 함께 전송
            {
                param,
                // params: {
                //     data: "nickname"
                // },
            },
        );
            console.log("response.data:");
            console.log(response.data);
            return [true, response.data];
    } catch (error) {
        // console.log("jsonRequestMsg:");
        // console.log(jsonRequestMsg);
        console.log("error:");
        console.log(error);
        return [false, `네트워크 연결 실패. \n 잠시 후 다시 시도해주세요`];
    }     
}

export const ResponsePost = async (path, jsonRequestMsg = {}) => {
// async function getResponsePost(jsonRequestMsg) {
    try{
        console.log("jsonRequestMsg");
        console.log(jsonRequestMsg);
        const response = await axios.post(path,
            jsonRequestMsg,
            { "Content-Type": "application/json", withCredentials: true },  //withCredentials: true: 브라우저에서 세션 쿠키(JSESSIONID)를 함께 전송
        );
            console.log("response.data:");
            console.log(response.data);
            return [true, response.data];
    } catch (error) {
        console.log("jsonRequestMsg:");
        console.log(jsonRequestMsg);
        console.log("error:");
        console.log(error);
        return [false, `네트워크 연결 실패. \n 잠시 후 다시 시도해주세요`];
    }        
}

export const ResponseDelete = async (path) => {
    try{
        const response = await axios.delete(path,
            { "Content-Type": "application/json", withCredentials: true },  //withCredentials: true: 브라우저에서 세션 쿠키(JSESSIONID)를 함께 전송
        );
            console.log("response.data:");
            console.log(response.data);
            return [true, response.data];
    } catch (error) {
        console.log("error:");
        console.log(error);
        return [false, `네트워크 연결 실패. \n 잠시 후 다시 시도해주세요`];
    }        
}