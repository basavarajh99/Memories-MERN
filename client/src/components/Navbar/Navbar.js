import React, { useState, useEffect } from 'react'
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core'
import memories from '../../images/memories.png';
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
    const history = useHistory();
    const location = useLocation();

     useEffect(() => {
        const token = user?.token;

        if(token){
            const decodeToken = decode(token);

            if(decodeToken.exp * 1000 < new Date().getTime()) 
                logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));
     }, [location]);


     const logout = () => {
        dispatch({ type: 'LOGOUT' });

        history.push('/');

        setUser(null);
        window.location.reload();
     }


    return (
    <AppBar className={classes.appBar} position='static' color='inherit'>
        <div className={classes.brandContainer}>
          <img src={memoriesText} style={{cursor: "pointer"}} onClick={() => window.location.pathname='/'} alt='icon' height='45px'  />
          <img className={classes.image} style={{cursor: "pointer"}} onClick={() => window.location.pathname='/'} src={memoriesLogo} alt="icon" height="40px" />
        </div>
        <Toolbar className={classes.toolbar}>
            {
                user ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
                        <Typography className={classes.userName} variant='h6'>{user.result.name}</Typography>
                        <Button variant='contained' className={classes.logout} color='secondary' onClick={logout} >Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to={'/auth'} variant="contained" color='primary' onClick={() => window.location.pathname='/auth'} >Sign in</Button>
                )
            }
        </Toolbar>
    </AppBar>
  )
}

export default Navbar