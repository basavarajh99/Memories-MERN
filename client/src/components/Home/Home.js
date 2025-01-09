import React, { useState, useEffect } from "react";
import { Container, Grow, Grid, Paper, AppBar, TextField, Button,} from "@material-ui/core";
import { useDispatch } from "react-redux";
import PagiNation from "../Pagination";
import { getPosts, getPostsBySearch } from "../../actions/posts";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
import { useHistory, useLocation } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import useStyles from "./styles";



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

  useEffect(() =>{
    dispatch(getPosts());
  }, [currentId, dispatch]);


  const searchPost = () => {
    if(search.trim() || tags){
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      history.push(`/posts/search?searchQuery=${search || "none"}&tags=${tags.join(',')}`)
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

  const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));


  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid
          className={classes.gridContainer}
          container
          justify="space-between"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
            {/*Sending the currentId and setCurrentId from parent component <Home/> to child component <Posts/>*/}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar
              className={classes.appBarSearch}
              position="static"
              color="inherit"
            >
              <TextField
                name="search"
                variant="outlined"
                label="Search Memories"
                onKeyDown={handleKeyPress}
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ChipInput 
                style={{ margin: '10px 0' }}
                value={tags}
                onAdd={(chip) => handleAdd(chip)}
                onDelete={(chip) => handleDelete(chip)}
                label="Search Tags"
                variant="outlined"
              />
              <Button onClick={searchPost} variant="contained" 
                className={classes.searchButton} color="primary">
                Search</Button>
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
