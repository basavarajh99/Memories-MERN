import React, {useState, useEffect} from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core'
import useStyles from './styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import { GoogleLogin } from 'react-google-login';
import Icon from "./Icon";
import { useDispatch } from 'react-redux';
import { gapi } from "gapi-script";
import { useHistory } from 'react-router-dom';
import { signup, signin } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

const Auth = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const history = useHistory();

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); //to prevent browsers default refresh operation after submitting the form

    if(isSignUp){
      dispatch(signup(formData, history));
    } else{
      dispatch(signin(formData, history));
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  } 
  /*
    while keeping all the formData as it is persistant, set only specific input field to target value that we 
    are currently on. 

    We are using same handleChange() for each input field otherwise you would have to change each state field
    separately which leads to redundant code.
  */

  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

  /*
    Whenever you are changing the previous state based on old state then you need to pass a callback function
    with a parameter inside setShowPassword() function used to update the state value, to toggle the show and 
    hide feature. 
  */


  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp)
    setShowPassword(false)
  }

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    /* ?. is optional chaining operator which is not going to throw an error if res object is not present */
    const token = res?.tokenId;
    try {
      dispatch({ type: 'AUTH', data: {result, token} })
      /* dispatches the google-sign-in action which is handled in reducers module */
      history.push('/') //redirects user to home once login is successfull

    } catch (error) {
        //window.alert("Google SignIn Failed");
        console.log(error);
    }
    
  }

  const googleFailure = (error) => {
    console.log(error);
    console.log("Google Sign In was failed. Try again later")
  }

  return (
    <Container component="main" maxWidth="xs" >
      <Paper className={classes.paper} elevation={3} >
        <Avatar className={classes.avatar} >
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit} >
          <Grid container spacing={2} >
            {
              isSignUp && (
                <>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                  {/*
                    CODE MODULARITY and REUSABILITY:
                    
                    We are going to have same input <TextField /> component and its general styles which are
                    going to look and behave same for different fields (like firstname, lastname, email, 
                    password ....) of signIn and signUp form hence instead of creating <TextField /> component 
                    each time and styling it again and again with same code; we can create a new separate 
                    custom <Input /> component that has all the above mentioned properties and generalised 
                    styles and we can invoke it here and use only those props inside each <Input /> component 
                    that are going to be different and going to change for each such component.
                    
                    In <Input /> component we have defined only one grid with all the necessary props which we 
                    are going to use again and again in this file, if we don't create a separate custom 
                    component the whatever is present in <Input /> should be repeated for each fields of form 
                    like firstName, lastName... in here which makes this file lengthy and redundant as well.

                    DATA HIDING:

                    As a beginer I used to create two different forms for signUp and signIn but now we are 
                    showing firstName, lastName, confirmPassword fields only if it's a signUp form else we are 
                    hiding them and showing only email and Password if it's a sigIn form Hence avoiding code 
                    redundancy as well.
                  */}
                </>
              )
            }
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} 
              type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
              {isSignUp && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} 
                type="password" /> } 
          </Grid>
          <Button type='submit' fullWidth variant="contained" color='primary' className={classes.submit} >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
            {/* 
              https://console.cloud.google.com/apis/dashboard?pli=1&project=traveller-356808 follow it 
              Follow this link to access google client id 
              
              The credentials belong to "bahadimani7@gmail.com"
            */}
            <GoogleLogin 
              clientId="301841449276-rnpcp1f7rpc97lkmjm6m7e4untqesprk.apps.googleusercontent.com"
              render = {(renderProps) => (
                <Button className={classes.googleButton} color="primary" fullWidth 
                  onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} 
                  variant="contained"> Google Sign In </Button>
              )} onSuccess={googleSuccess} onFailure={googleFailure} cookiePolicy="single_host_origin"
            />
          <Grid container justifyContent='flex-end' >
            <Grid item>
              <Button onClick={switchMode} >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" }
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth