import React, { useState, useRef } from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { commentPost} from '../../actions/posts';
import useStyles from "./styles";

const Comments = ({ post }) => {
  //console.log(post);
  const classes = useStyles();
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("profile"));
  const dispatch = useDispatch();
  const commentsRef = useRef();

  const handleClick = async () => {
    const finalComment = `${user.result.name}: ${comment}`;
    dispatch(commentPost(finalComment, post._id));

    //reciveing the new comment on the post and posting it inside comments
    const newComments = await dispatch(commentPost(finalComment, post._id));

    setComments(newComments);
    setComment('');

    //commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">Comments</Typography>
          {comments.slice().reverse().map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle1">
              <strong>{c.split(': ')[0]}</strong>
                {c.split(':')[1]} 
            </Typography>
          ))}
          {/*<div ref={commentsRef} />*/}
        </div>
        {user?.result?.name && ( 
          <div style={{ width: "70%" }}>
            <Typography gutterBottom variant="h6">Write a Comment</Typography>
            <TextField fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} 
              onChange={(e) => setComment(e.target.value)}/>
            <Button style={{ marginTop: "10px" }} fullWidth disabled={!comment} color="primary" 
              variant="contained" onClick={handleClick}>Comment</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
