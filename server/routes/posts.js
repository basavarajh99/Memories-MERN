import express from 'express';
import { getPosts, getPost, getPostsBySearch, createPost, updatePost, deletePost, likePost, commentPost } from '../controllers/posts.js';
/*
    The above imports use {} since they are not expoted as "export default" from posts.js of controllers
    but with different names.
*/
import auth from '../middleware/auth.js';

const router = express.Router(); //Sets up the router

//localhost:5000/posts

/*
    Each of the following routes takes 'path' to route and callback function as parameters
    each callback function will have request(req) and response(res).
    
    The logic of all these callback functions or handlers is built in posts.js file of controllers module
*/

router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);
/*
    All the users no matter what they can see the posts but to modify or create a post the user needs to have
    suitable permissions hence we use middleware before routing in the following routes.
*/

router.post('/', auth, createPost); //Post is used to create a new resource on the server.
router.patch('/:id', auth, updatePost); //Patch is used for updating the existing documents hence we need ':id'
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost); 
/*
    liking post means updating likes count hence it's a patch request but not a post request and we are using 
    auth middleware even though all the users can like the post because a logged in user can like only once
    hence to avoid incrementing the likes by a single user multiple times we need the middleware to verify
    whether it's the first like or not.

    we can also populate 'req' before proceeding to next controller if we are using middleware before it.
*/
router.post('/:id/commentPost', auth, commentPost);

/*
    The export keyword is used in JavaScript to make variables, functions, classes, or objects available to 
    other files (modules). Modules in JavaScript allow for code to be split into smaller, reusable files and 
    enable functionality sharing between them.
    When you use export default, it specifies that the module has a single main export.
    The importing file does not need to use curly braces {} when importing this export. 
    It can assign any name to the imported value.
*/

export default router;