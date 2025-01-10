import axios from "axios";

/* axios used to make api calls */
const API = axios.create({ baseURL: "http://localhost:5000" });

//https://memories-mern-giqr.onrender.com

/* 
  Following function is used to implement the middleware which is going to execute for each of the
  user request. we need this because we have to send the token to the backend so that middleware 
  can verify that user is actually Logged-In.
*/

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

export const fetchPosts = (page) => API.get(`/posts?page=${page}`);

export const fetchPost = (id) => API.get(`/posts/${id}`);

export const fetchPostsBySearch = (searchQuery) =>
  API.get(
    `/posts/search?searchQuery=${searchQuery.search || "none"}&tags=${searchQuery.tags}`
  ); /* query params start with a '?' following it a variable name which is used to search for a 
      specific post by value entered in search text field or in tags field */

export const createPost = (newPost) => API.post("/posts", newPost);

export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
  /*
    this passed 'id' will be available on the backend side inside 'req.params' and 'updatedPost' as a payload
    inside 'req.body'
  */ 

export const deletePost = (id) => API.delete(`/posts/${id}`);

export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });
//id inside req.params and value which is a comment as payload inside req.body

export const signIn = (formData) => API.post("/user/signin", formData);

export const signUp = (formData) => API.post("/user/signup", formData);
