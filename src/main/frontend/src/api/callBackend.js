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
        console.log("error:");
        console.log(error);
        return [false, error];
    }     
}

export const ResponsePost = async (path, jsonRequestMsg = {}) => {
// async function getResponsePost(jsonRequestMsg) {
    try{
        console.log("jsonRequestMsg");
        console.log(jsonRequestMsg);
        const response = await axios.post('/api/claude/betweenphrase',
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
        return [false, error];
    }        
}
