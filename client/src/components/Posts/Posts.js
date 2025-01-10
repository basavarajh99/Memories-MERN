import React from 'react'
import Post from './Post/Post'
import useStyles from  './styles'
import { useSelector } from 'react-redux'
import { Grid, CircularProgress } from '@material-ui/core'

const Posts = ({setCurrentId}) => {
  const classes = useStyles();

  const { posts, isLoading } = useSelector((state) => state.posts);
  /*
    we are getting state.posts from posts exported from combineReducer() in index.js file of reducers and we
    are destructuring it to obtain posts which will be later traversed using map() to send each individual
    post to <Post /> component
    
    Selectors are functions that know how to extract specific pieces of information from a store state value. 
    As an application grows bigger, this can help avoid repeating logic as different parts of the app need to 
    read the same data
  */

  if(!posts.length && !isLoading ) return 'No Posts';

  //console.log(posts);
  return (
    isLoading ? <CircularProgress /> : 
      <Grid className={classes.mainContainer} container alignItems='stretch' spacing={3}>
        {posts.map((post) => (
          <Grid key={post.id} item xs={12} sm={12} md={6} lg={3} >
            {/* 
              how many posts are shown per page xs=12 means on extra small devices only 1 post same for small
              for medium 2 posts and for large screens 4 posts.
            */}
            <Post post={post} setCurrentId={setCurrentId} /> 
            {/* 
                Parent component <Home /> Passes the {setCurrentId} prop to the child component <Posts />.
                <Posts /> passes the the {post} obtained from global redux store and {setCurrentId} further
                to child component <Post /> hence this passing of '{setCurrentId}' prop from <Home /> to
                <Posts /> then to <Post /> is known as "Prop Drilling".

                To avoid Prop drilling we use 'Global redux store', ex: {post} object is obtained from redux
                store but not passed as prop in hierarchy.

                Child component <Post /> Displays data from {post} object. Calls setCurrentId(post.id) when the 
                button is clicked, which updates the currentId state in the parent component.

                In React, props (short for "properties") are a mechanism for passing data from a parent 
                component to a child component. They allow components to be dynamic and reusable by providing 
                them with external data or configuration. 
                
                Props are Immutable, Passed from Parent to Child, Accessed via props Object
            */}
          </Grid>
        ))} {/* Map(): It creates a new array populated with the 
        results of calling a provided function on every element in the original array */}
      </Grid>
  )
}

export default Posts