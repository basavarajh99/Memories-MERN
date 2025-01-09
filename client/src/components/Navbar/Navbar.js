import React, { useState, useEffect } from 'react'
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core'
import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/memoriesText.png';
import useStyles from './styles';
import decode from 'jwt-decode';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Navbar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    /* we get the user profile from localStorage and parse it to JSON format */
    const history = useHistory();
    const location = useLocation();

     useEffect(() => {
        const token = user?.token;

        if(token){
            const decodeToken = decode(token);
            /* checking if the token has expired or not, if expired then logout */
            if(decodeToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));
     }, [location]);

     /* this useEffect() is for redirecting user to main page once user logs in or token expires */

     const logout = () => {
        dispatch({ type: 'LOGOUT' });

        history.push('/');

        setUser(null);
     }


    return (
    <AppBar className={classes.appBar} position='static' color='inherit'>
        <div className={classes.brandContainer}>
          <img src={memoriesText} style={{cursor: "pointer"}} onClick={() => history.push('/')} 
            alt='icon' height='45px'  />
          <img className={classes.image} style={{cursor: "pointer"}} onClick={() => history.push('/')} 
            src={memoriesLogo} alt="icon" height="40px" />
        </div>
        <Toolbar className={classes.toolbar}>
            {
                user ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>
                            {user.result.name.charAt(0)} </Avatar>
                        {/* showing first character of the name on the navbar*/}
                        <Typography className={classes.userName} variant='h6'>{user.result.name}</Typography>
                        <Button variant='contained' className={classes.logout} color='secondary' 
                        onClick={logout} >Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to={'/auth'} variant="contained" color='primary'>Sign in</Button>
                )
            }
            {/*
                If a user is logged in then show his profile else show a button to login
            */}
        </Toolbar>
    </AppBar>
  )
}

export default Navbar