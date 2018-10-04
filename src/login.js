import React, {Component} from "react"
import {Link} from "react-router-dom";
import fire from "./fire"
import firebase from "firebase"
import { connect } from 'react-redux';
import * as actionTypes from "./actionType/action";
import "./css/loginPage.css"

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            userName : "",
            buttonValue : "Sign In",
        }
    }

    componentDidMount() {
        console.log(this.props);
        firebase.auth().onAuthStateChanged((user)=> {
            if (user) {
              // User is signed in.
                this.setState({buttonValue : "Sign Out"});
            } else {
              // No user is signed in.
                this.setState({buttonValue : "Sign In"});
            }
          });
    }

    signIn = ()=> {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result)=> {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log("login success");
            this.props.login(user)
            this.setState({userName : this.props.user.displayName});
            window.location.assign("/chat");
            // user = JSON.stringify(user);
            // localStorage.setItem('user', user);
            // ...
          }).catch((error)=> {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log("error");
          });
        // firebase.auth().signInWithRedirect(provider);
        // firebase.auth().getRedirectResult().then(function(result) {
        //     if (result.credential) {
        //       // This gives you a Google Access Token. You can use it to access the Google API.
        //       var token = result.credential.accessToken;
        //       // ...
        //     }
        //     // The signed-in user info.
        //     var user = result.user;
        // }).catch(function(error) {
        //     // Handle Errors here.
        //     var errorCode = error.code;
        //     var errorMessage = error.message;
        //     // The email of the user's account used.
        //     var email = error.email;
        //     // The firebase.auth.AuthCredential type that was used.
        //     var credential = error.credential;
        //     // ...
        // });
    } 

    signOut = ()=> {
        firebase.auth().signOut().then(()=> {
            // Sign-out successful.
            this.setState({buttonValue : "Sign In"})
            console.log("sign Out");
          }).catch((error)=> {
            // An error happened.
          });
    }

    authHandle= () =>{
        if (this.state.buttonValue === "Sign In") {
            this.signIn();
        }
        else  {
            this.signOut();
        }
    }

    render () {
        return(
            <div className="App">
                <div className="background"></div>
                <div className="loginBtn" >
                    <button onClick={this.authHandle}><p>{this.state.buttonValue}</p></button>
                </div>
            </div>
        )
    } 
}

const mapStateToProps = (state) => {
    return {
      user : state.auth.user
    }
  }
  
const mapDispatchToProps = (dispatch) => {
    return {
      login : (user)=> {dispatch ({type: actionTypes.loggedIn, payload: user})},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);