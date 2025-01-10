import { FETCH_ALL, CREATE, UPDATE, LIKE, DELETE, FETCH_BY_SEARCH, START_LOADING, END_LOADING, 
    FETCH_POST, COMMENT} from "../constants/actionTypes";
    
    /*
        whatever is present inside this file, it is available inside global redux store that can be accessed
        using useSelector()
    */

export default (state = { isLoading: true, posts: [] }, action) => {
    switch (action.type) {
        case START_LOADING:
            return { ...state, isLoading: true }
        case END_LOADING:
            return { ...state, isLoading: false }
        case FETCH_ALL:
            return {
                ...state,
                posts: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
            }; //now payload contains 3 different things, hence we need to update the variables base on those.
        case FETCH_BY_SEARCH:
            return { ...state, posts: action.payload }; //earlier it was ...posts intead of ...state
        case FETCH_POST:
            return { ...state, post: action.payload };
        case CREATE:
            return {...state, posts: [...state.posts, action.payload]};//action.payload stores the new post
        case UPDATE:
            return { ...state, posts: state.posts.map((post) =>
                post._id === action.payload._id ? action.payload : post
            )}; 
            /*
                o/p of the map() will be a newly created array after applying the changes on original array 
                action.payload has the updated post
            */             
        case LIKE:
            return {...state, posts: state.posts.map((post) =>
                post._id === action.payload._id ? action.payload : post
            )}; 
            /*
                action.payload now has only 'id' of the liked post function is same as update since we are 
                updating likes count only
            */ 
        case COMMENT: 
            return { ...state, posts: state.posts.map((post) => {
                //return the post that recieved the comment
                if(post._id === action.payload._id) return action.payload;
                //else just send all the posts
                return post;
            })}
        case DELETE:
            return {...state, posts: state.posts.filter((post) => post._id !== action.payload)};
            /* 
                action.payload has 'id' of the post that needs to be deleted, which is sent from posts.js of
                action module.
                here we are filtering out and keeping all the posts whose id is not same as the one that needs 
                to be deleted hence deleting only the selected post 
            */
        default:
            return state;
    }
};
