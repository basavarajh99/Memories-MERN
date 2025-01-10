import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

/*
    The following function uses 'async' keyword before a function declaration allows the function to use 'await' 
    within its body. This makes the function asynchronous, meaning it will pause execution at each 'await' 
    statement until the awaited Promise resolves or rejects.
*/

export const getPosts = async  (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8; // number of posts per page
        
        const startIndex = (Number(page) - 1) * LIMIT; 
        /*
            get start index of a post on a specific page
            ex: 1st post on 3rd page = (8 + 8 + 8) - 1; because we start from 0
            
            Eventhough page is a number on the client side, it is converted as a string when it is passed 
            inside an URL hence to convert it back to number use Number() constructor.

        */
        
        const total = await PostMessage.countDocuments({});
        /* 
            we need to count the total number of posts necause depending on this count we know what is the
            last page number inside pagination.        
        */ 

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        /*
            By using await, the code pauses at these lines until the Promises resolve, and then it proceeds 
            with the resolved values (total and posts).

            Without async/await, you would typically use '.then()' to handle Promises, 
            resulting in nested or chained callbacks. async/await makes the code more readable and resembles 
            synchronous flow.
        */
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    
    } catch(error) {
        res.status(404).json({message: error.message});
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

/*
    Search query: begins with a ‘?’ ex: /posts?page=1
    Search params: begins with a ‘:’ ex: /posts/:id
*/

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i'); 
        //'i' flag stands for ignore i.e, the case of searchQuery
        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ] })
        /*
            $or: Either find by matching the title or the tag
            $in: Is there at least one matching tag in the array of tags formed by splitting the strings on ','
                 got inside search query.
        */

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    /*
        The values are received from the front-end form for creating the posts which is inside Form.js of Form
        component of client module
    */
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
    try {
        await newPost.save();
        
        res.status(201).json(newPost);
    } catch(error) {
        res.status(409).json({message: error.message});
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params; //id is sent inside route './:id'
    const { title, message, creator, selectedFile, tags } = req.body;

    //req.body contains the payload sent by user from front side
    //req.params contains URL route parameters
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    /* checking if the 'id' is really a mongoose object id */
    
    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });
    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({message: 'Post deleted successfully'})
}

export const likePost = async (req, res) => {
    const { id } = req.params;
    
    /*
        It's possible only because we are using middleware before liking a post which is populating req.userId
        and making it available in here. 
    */
    if(!req.userId) return res.json({message: 'Unauthenticated'});

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id); //checking if the post is available that user wants to like

    const index = post.likes.findIndex((id) => id ===String(req.userId));
    /*
        checking if the userId is already in the like section or not. Each like is going to be a unique id
        posted from a specific person, that's how we differentiate likes from different users. 
    */
    if (index === -1) {
        //It means that this is the 1st like of the current loggedIn user hence store it in likes array
        post.likes.push(req.userId);
    } else{
        /*
            it means that current loggedIn user has already liked the post and if he is trying to like the post
            remove the his like from likes array by filtering it out using "Id" which represents a specific 
            like. 
        */
      post.likes = post.likes.filter((id) => id !== String(req.userId));
        /*
            filter() gives all the likes except the one that current loggedIn user has posted and that's how 
            his like is removed.
        */
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});

    res.json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate( id, post, { new: true });

    res.json(updatedPost);
}