import * as actionTypes from "../actionType/action"

//this is for incrtement and decrement
const INITIAL_STATE = {
    counter : 0
}
export const counterReducer = (state = INITIAL_STATE ,action) => {  //yhan action me sari values jo humne dispatch kri thi vo ayengi
    if(action.type === actionTypes.INCREMENT_COUNTER) {
        return {
            ...state ,  // yhan hum copy bna rhe hai counter ki kyunki directly state.counter ko access nhii kr skte hai nd krna bhi nii chahiye
                        //this says ki state(which is initialised as initial state) k andr jitn ebhi object hai unko access kro
            counter : state.counter + action.payload  //yhan counter state.counter ka copy bnaya hai humne
        }
    }
    else if (action.type === actionTypes.DECREMENT_COUNTER) {
        return {
            ...state , 
            counter : state.counter - action.payload
        }
    }
    return state
}