import React, { useState, useEffect } from 'react'
import useStyles from  './styles'
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64'
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost } from '../../actions/posts';
import { useHistory } from 'react-router-dom';

const Form = ({currentId, setCurrentId}) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: '', selectedFile: ''})
  const post = useSelector((state) => (currentId ? state.posts.posts.find((p) => p._id === currentId) : null));
  /* 
    we don't want all the posts, we just need the data of the Post that needs to be updated hence we will 
    find the post from posts whose id is same as current selected post id
  */

  const classes = useStyles();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();


  useEffect(() => {
    if(post)
      setPostData(post);
  }, [post]);

  /*
    useEffect() will call the callback function () if there is any changes on [post] (dependency array)
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentId === 0) { 
      {/* currentId stands for "currently selected post id" but not currently created new post id hence currentId
          is '0' for newly created post where as it is non-zero for the post to be updated.   
          */}
      dispatch(createPost({ ...postData, name: user?.result?.name  }, history));
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
    }
    clear() /* after creating or updating a post we set the form back to original blank state */
  };
  /* 
    once you click the submit we want to send all the user data as apost request, you will dispatch the 
    createPost/updatePost action created in posts.js of actions and to do this you need access to global redux 
    store for which you need to import useDispatch() and after this you will dispatch the createPost/updatePost 
    action that is exported based on currentId value.
  */

  if(!user?.result?.name){
    return (
      <Paper className={classes.paper}> {/* just like a div but with white background */}
        <Typography variant='h6' align='left'>
          Please Sign In to create your own memories and to like and comment on other's memories.
        </Typography>
      </Paper>
    )
  }

  const clear = () => {
    setCurrentId(null);
    setPostData({ title: '', message: '', tags: '', selectedFile: ''});
  }
  /*
    Once you submit the updated post, set the current selected post id to null and set all the fields of form
    back to original blank state
  */

  return (
    <Paper className={classes.paper} elevation={6} >
      <form autoComplete='off' noValidate className={`${classes.root} ${classes.form}`} 
        onSubmit={handleSubmit}>
          {/* 
            if current selected post id is not null then we are editing an existing post otherwise we are
            creating a new one.
          */}
        <Typography variant='h6'>{currentId ? 'Editing' : 'Creating'} a Memory</Typography>
        {/* 
          In onChange() method to avoid overwriting of all the form fields we first spread the post data 
          making sure that all the other data persists and we are simply changing only the fields in a 
          specific textfield 
        */}
        <TextField name='title' variant='outlined' label='Title' fullWidth value={postData.title} 
          onChange={(e) => setPostData({...postData, title: e.target.value})} />
        <TextField name='message' variant='outlined' label='Message' fullWidth value={postData.message} 
          onChange={(e) => setPostData({...postData, message: e.target.value})} />
        <TextField name='tags' variant='outlined' label='Tags' fullWidth value={postData.tags} 
          onChange={(e) => setPostData({...postData, tags: e.target.value.split(',')})} />
          {/* 
            here in tags we are splitting the tags string by ',' and returning it as an array using the split()
            method.
          */}
        <div className={classes.fileInput}>
          <FileBase type="file" multiple={false} onDone={({base64}) => setPostData({ ...postData, 
            selectedFile: base64 })} />
        </div>
        <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' 
          type='submit' fullWidth>Submit</Button>
        <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  )
}

export default Form