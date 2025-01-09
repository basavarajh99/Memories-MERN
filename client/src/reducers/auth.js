import { AUTH, LOGOUT } from '../constants/actionTypes';

/*
    A reducer is a function that receives the current state and an action object, decides how to update the 
    state if necessary, and returns the new state: (state, action) => newState. You can think of a reducer as 
    an event listener which handles events based on the received action (event) type.

    They should only calculate the new state value based on the state and action arguments. 
    
    They are not allowed to modify the existing state. Instead, they must make immutable updates, by copying 
    the existing state and making changes to the copied values.
    
    They must not do any asynchronous logic, calculate random values, or cause other "side effects"
*/

const authReducer = (state = { authData: null }, action) => {
    switch (action.type) { 
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }))
            return { ...state, authData: action?.data };
            /* This data inside localStorage will be used inside Navbar.js to display profile's info */
        case LOGOUT:
            localStorage.clear();
            return { ...state, authData: null };


        default:
            return state;
    }
}

export default authReducer