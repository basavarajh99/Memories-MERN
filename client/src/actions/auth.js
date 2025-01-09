import * as api from '../api'
import { AUTH } from '../constants/actionTypes';

/*
    Actions: An action is a plain JavaScript object that has a type field. You can think of an action as an 
    event that describes something that happened in the application.
    
    The 'type' field (specified in actionTypes.js of constants module) should be a string that gives this 
    action a descriptive name, like "todos/todoAdded". We usually write that type string like 
    "domain/eventName", where the first part is the feature or category that this action belongs to, and 
    the second part is the specific thing that happened.
    
    An action object can have other fields with additional information about what happened. By convention, 
    we put that information in a field called payload.

    Dispatch: The Redux store has a method called dispatch. The only way to update the state is to call 
    dispatch() and pass in an action object. The store will run its reducer function and save the new state 
    value inside, and we can call getState() to retrieve the updated value:
*/

export const signin =  (formData, history) => async (dispatch) => {

    /*
        If ACTION CREATORS are asynchronus then we need to use redux-thunk, A function that returns an async 
        function with a dispatch
    */

    try {
        
        const { data } = await api.signIn(formData);

        dispatch({type: AUTH, data});

        history.push('/')

    } catch (error) {
        console.log(error);
    }
}
export const signup =  (formData, history) => async (dispatch) => {
    try {
        
        const { data } = await api.signUp(formData);
        
        dispatch({type: AUTH, data});
        
        history.push('/')
        
    } catch (error) {
        console.log(error);
    }
}