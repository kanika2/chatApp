import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router , Route} from "react-router-dom"
import {createStore, combineReducers, applyMiddleware }from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import {loginReducer} from "./reducers/loginReducer";
import {counterReducer} from "./reducers/reducer";

import ChatApp from './App';
import Login from './login';
import Boot from "./gridCheck";
import ChatRooms from "./component/chatRoom";

//import Lifecycle from './reactlifecycle';

const reducer = combineReducers({
    auth: loginReducer,
    counter: counterReducer
});

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const store = createStoreWithMiddleware(reducer)

const appRoute = (
    <Provider store = {store}> 
        <Router>
            <div>
                <Route exact path="/" component = {Login} />
                <Route exact path="/chat/:chatName" component = {ChatApp} />
                <Route exact path="/boot" component = {Boot} />
                <Route exact path="/chatrooms" component = {ChatRooms} />
            </div>
        </Router>
    </Provider>

)

ReactDOM.render(appRoute, document.getElementById('root'));
registerServiceWorker();
