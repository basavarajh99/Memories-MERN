import React, { useState } from 'react'
import useStyles from  './styles'
import { Card, CardActions, CardContent, CardMedia, Button, ButtonBase, Typography } from '@material-ui/core'; 
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/posts';
import { useHistory } from 'react-router-dom';

const Post = ({ post, setCurrentId }) => { {/* getting both the props from Posts.js */}
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();
  const [likes, setLikes] = useState(post?.likes);
  
  const userId = user?.result.googleId || user?.result?._id;
  const hasLiked = post?.likes?.find((like) => like === userId);

  const handleClick = async () => {

    dispatch(likePost(post._id))

    if(hasLiked){
      setLikes(post.likes.filter((id) => id !== userId))
    } else{
      setLikes([ ...post.likes, userId])
    }
  } 

  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId)
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }
    {/* the &nbsp adds space since JSX can't interprete normal space as blank space */}
    return <><ThumbUpAltOutlined fontSize="small" displ />&nbsp;Like</>;
  };
    
  const openPost = () => {
    history.push(`/posts/${post._id}`);
  };


  return (
    <Card className={classes.card} raised elevation={6} >
        <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
          <div className={classes.overlay}>
            <Typography variant='h6' >{post.name}</Typography>
            <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography> 
              {/* Moment is used to show when the post was created like '5min ago' */}
          </div>
          {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
            <div className={classes.overlay2}>
              <Button style={{color: 'white', justifyContent: 'right' }} size="small" 
              onClick={() => setCurrentId(post._id)} > <MoreHorizIcon fontSize="medium" /> </Button>
              {/* To edit the post we are setting the post id to current post id in both post and 
                form component, since setCurrentId is passed to both form and post component */}
            </div> )}
          <ButtonBase className={classes.cardAction} onClick={openPost}>
            <div className={classes.details}>
              <Typography variant='body2' color='textSecondary' component="h2">
                {post.tags.map((tag) => `#${tag} `)} 
                {/* loop in the tags array and prefix each tag with '#' */}
              </Typography>
            </div>  
            <Typography className={classes.title} gutterBottom variant="h6" component="h2" >
              {post.title}</Typography>
            <CardContent>
              <Typography variant='body2' color='textSecondary' component="p">{post.message}</Typography>
            </CardContent>
        </ButtonBase>

          <CardActions className={classes.cardActions}>
          {userId && (
            <Button size='small' color='primary'  onClick={handleClick}>
               <Likes />
            </Button>
          )}
          {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
            <Button size='small' color='primary' onClick={() => dispatch(deletePost(post._id))}>
              {/* 
                  this onClick() dispatch deletePost action and the DELETE case inside reducer performs the
                  delete operation using filter() method.
                */}
              <DeleteIcon fontSize='small' />
                Delete
            </Button>
          )}
        </CardActions>
    </Card>
  )
}

export default Post