const COUNT = 'COUNT'


export const testCount =()=>{
    return{
        type:COUNT,
    }
};

const initialState ={value:'ㄱ'};

const test = (state=initialState,action)=>{
    switch (action.type){
        case COUNT:
            return {...state,value: state.value+"ㄴ"}
        default:
            return state
    }
}

export default undoText;