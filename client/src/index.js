import React from 'react';
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import './index.css'
import App from './App';

import reducers from './reducers';
/*
    Here we are importing the combined reducer of both post and auth from index.js of reducers component
*/


const store = createStore(reducers, compose(applyMiddleware(thunk)));

/*
    createStore(): Creates a Redux store that holds the complete state tree of your app. 
    There should only be a single store in your app.

    applyMiddleware(thunk):
        applyMiddleware: A Redux utility function that allows you to enhance the store by applying middleware.
        
        thunk: Middleware (from the redux-thunk package) that lets you write action creators that return 
        function instead of plain action objects. This is useful for handling asynchronous actions like API calls.
    
    compose(...): A utility function from Redux that allows you to compose multiple store enhancers into one. 
    In this case, it is used to apply middleware (like thunk) and potentially other enhancers.
*/

const root = ReactDOM.createRoot(document.getElementById("root"));

/*
    The <Provider> component makes the Redux store available to any nested components that need to access the 
    Redux store. Since any React component in a React Redux app can be connected to the store, most apps
    will render a <Provider> at the top level, with the entire app’s component tree inside of it.

    Store: The current Redux application state lives in an object called the store .
    The store is created by passing in a reducer, and has a method called getState() that returns the 
    current state value
*/

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
  );
