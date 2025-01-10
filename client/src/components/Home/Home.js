import React, { useState, useEffect } from "react";
import { Container, Grow, Grid, Paper, AppBar, TextField, Button,} from "@material-ui/core";
import { useDispatch } from "react-redux";
import PagiNation from "../Pagination";
import { getPosts, getPostsBySearch } from "../../actions/posts";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";

import { useHistory, useLocation } from "react-router-dom";
/*
  useLocation: To determine on which page the user currently in.
  useHistory: To renavigate the user to certain pages.
*/

import ChipInput from "material-ui-chip-input";
import useStyles from "./styles";

/*
  URLSearchParams: To know user is on which page currently and what search term are we looking for.
 */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const query = useQuery();
  const history = useHistory();
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch(); //useDispatch hook gives us the store's dispatch method to dispatch actions.
  const page = query.get("page") || 1;
  const searchQuery = query.get("searchQuery");
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);

  const searchPost = () => {
    if (search.trim().length || tags.length){
      
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      /* we can't pass an array of tags inside a search query hence we join the tags to make it as a string */
      
      history.push(`/posts/search?searchQuery=${search || "none"}&tags=${tags.join(',')}`)
      //moving to specific URL after the seach is successfull.
    } else {
      history.push('/');
    }
  }

  const handleKeyPress = (e) => {
    if(e.keyCode === 13){ //enter key
      searchPost();
    }
  }
  
  const handleAdd = (tag) => setTags([...tags, tag]);

  const handleDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
    history.push('/');
  }


  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid className={classes.gridContainer} container justify="space-between" alignItems="stretch" 
          spacing={3}>
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
            {/*Sending the currentId and setCurrentId from parent component <Home/> to child component 
            <Posts/>*/}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar className={classes.appBarSearch} position="static" color="inherit">
              <TextField name="search" variant="outlined" label="Search Memories" onKeyDown={handleKeyPress} 
                fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
              <ChipInput style={{ margin: '10px 0' }} value={tags} onAdd={(chip) => handleAdd(chip)} 
                onDelete={(chip) => handleDelete(chip)} label="Search Tags" variant="outlined" />
              <Button onClick={searchPost} variant="contained" className={classes.searchButton} color="primary"
                >Search</Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {/* 
              Sending the currentId and setCurrentId from parent component <Home /> to child component <Form />. 
              To avoid this repeating task of passing props from parent to children we use Redux which 
              has global redux store that can be accessed in the entire application.  
            */}
            {(!searchQuery && !tags.length) && (
              <Paper elevation={6} className={classes.pagination} >
                <PagiNation page={page} />
              </Paper>
            ) }
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
