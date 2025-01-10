import * as api from '../api'
import { FETCH_ALL, COMMENT, FETCH_POST, START_LOADING, END_LOADING, FETCH_BY_SEARCH, CREATE, UPDATE,
    LIKE, DELETE } from '../constants/actionTypes';

    /*
        ACTION CREATORS: It is another common convention that, instead of creating action objects inline in the
        places where you dispatch the actions, you would create functions generating them. 
                                            or
        We can simply say it as "function returning an action"

        'type:' inside each action gets its value which is a string from actionType specified inside constants 
         module so that we don't make any errors while specifying those strings, if we make any errors while
         specifying those strings then we can't find those errors in console hence it becomes difficult to 
         debug the error hence we specify them inside constants module.

        With redux thunk since we will be dealing with asynch logic we are adding asynch(dispatch) to dispatch
        the action
    */

export const getPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await api.fetchPost(id);
        /*
            here we are getting response from the api and response has data object which we are destructuring
            data actually represents the post, and we are dispatching it using redux dispatch().
        */
        //console.log(data);

        dispatch({ type: FETCH_POST, payload: data });
        dispatch({ type: END_LOADING })
        
    } catch (error) {
        console.log(error);
    }
}
export const getPosts = (page) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await api.fetchPosts(page);
        //passing the page to the backend to know which page we are on
        
        dispatch({ type: FETCH_ALL, payload: data });
        /*
            The payload now not just the posts but now contains an object that has 3 different things
            it contains data of the posts, current page, and also the number of pages. 
        */

        dispatch({ type: END_LOADING })

    } catch (error) {
        console.log(error);
    }
}

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data: { data } } = await api.fetchPostsBySearch(searchQuery);
        dispatch({ type: FETCH_BY_SEARCH, payload: data });
        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log(error);
    }
}

export const createPost = (post, history) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await api.createPost(post);
        history.push(`/posts/${data._id}`)
        dispatch({ type: CREATE, payload: data });
        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log(error);
    }
}

export const updatePost = (id, post) => async (dispatch) => {
    try {
        const { data } = await api.updatePost(id, post);
        dispatch({ type: UPDATE, payload: data })
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = (id) => async (dispatch) => {
    try {
        await api.deletePost(id);
        dispatch({ type: DELETE, payload: id });
    } catch (error) {
        console.log(error);
    }
}

export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id);
        dispatch({ type: LIKE, payload: data })
    } catch (error) {
        console.log(error);
    }
}

export const commentPost = (value, id) => async (dispatch) => {
    try {
        
        const { data } = await api.comment(value, id);

        dispatch({ type: COMMENT, payload: data })
        
        return data.comments;
        
    } catch (error) {
        
        console.log(error);
    
    }
}