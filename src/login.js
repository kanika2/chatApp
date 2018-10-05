import React, {Component} from "react"
import {Link} from "react-router-dom";
import fire from "./fire"
import firebase from "firebase";
import { connect } from 'react-redux';
import * as actionTypes from "./actionType/action";
import "./css/loginPage.css"

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            userList : [],
            userName : "",
            userEmail: "",
            buttonValue : "Sign In",
            database : fire.database(),
        }
    }

    componentDidMount() {
        // console.log(this.props);
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


    sendUserDatabse = () => {
        var users = {
            author: this.state.userName,
            authorMail : this.state.userEmail,

        }
        this.state.database.ref("/Users").push(users);
    }

    readUserDatabase = ()=> {
        this.state.database.ref("/Users").once("value", (chatValue) => {
            var chatter = chatValue.val(); 
            let userArray = [];
            for (let key in chatter){
                // copying data from database to array of object
                console.log(chatter[key]);
                userArray.push(chatter[key]);
            }
            this.setState({userList : userArray});
        });
        this.state.userList.map((value, index) => {
            return (
                <div>
                    {(value.authorMail ==!  this.state.userEmail) ? this.state.sendUserDatabse(): console.log("hello")}
                </div>
            );
        })
        // this.sendUserDatabse();        
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
            // console.log(user);
            this.setState({userName : this.props.user.displayName, userEmail: this.props.user.email});
            this.readUserDatabase();
            
            window.location.assign("/chat");
            user = JSON.stringify(user);
            localStorage.setItem('user', user);
          }).catch((error)=> {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log(" aa gya error");
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
                <div className="background">
                    <h2 className="chatAppTitle">The ChatApp</h2>
                </div>
                <div className="userWrapper">
                    <div className="userImage"></div>
                    <div className="userName">
                        <h2>{this.state.user.displayName}</h2>
                    </div>
                </div>
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