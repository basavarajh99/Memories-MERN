import React from 'react'
import { Container } from '@material-ui/core';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import PostDetails from './components/PostDetails/PostDetails';

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  return (
    <BrowserRouter>
      <Container maxWidth="xl"> {/* The container centers your content horizontally */}
        <Navbar />
        <Switch>
          <Route path='/' exact component={() => <Redirect to="/posts" />} />
          <Route path="/posts" exact component={Home} />
          <Route path="/posts/search" exact component={Home} />
          <Route path="/posts/:id" exact component={PostDetails} />
          
          <Route path='/auth' exact component={() => (!user ? <Auth /> : <Redirect to="/posts" />)} />
          {/* If user is not logged in then only direct him to Signin form inside Auth component else redirect 
           him to home page */}
        
        </Switch>
      </Container>
    </BrowserRouter>
  )
}

/*
  We can achieve navigation in react app using react-router-dom
*/

export default App