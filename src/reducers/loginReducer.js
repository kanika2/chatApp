import * as actionTypes from "../actionType/action"

const INITIAL_STATE = {
    user : {},
    user_status : false
}

export const loginReducer = (state = INITIAL_STATE , action)=> {
    if (action.type === actionTypes.loggedIn) {
        return {
            ...state , 
            user_status : true, 
            user : action.payload
        }
    }
    return state
}