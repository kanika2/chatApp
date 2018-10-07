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
            user: {},
            userName : "",
            userEmail: "",
            userImage: "",
            buttonValue : "Sign In",
            database : fire.database(),
            loading: true
        }
    }

    componentDidMount() {
        // console.log(this.props);
        firebase.auth().onAuthStateChanged((user)=> {
            if (user) {
              // User is signed in.
                console.log(user);
                console.log(user.providerData[0].photoURL);
                let userImage = "url('"+user.providerData[0].photoURL+"')";
                this.setState({buttonValue : "Sign Out", user, userImage});
            } else {
              // No user is signed in.
                this.setState({buttonValue : "Sign In"});
            }
            this.setState({loading: false});
        });

    }

    sendUserDatabse = () => {
        console.log("sendUser");
        var users = {
            author: this.props.user.displayName,
            authorMail : this.props.user.email,
            authorPhoto : this.props.user.providerData[0].photoURL,
            typing: false,
            online: false,
        }
        this.state.database.ref("/Users").push(users);
    }

    readUserDatabase = ()=> {
         this.state.database.ref("/Users").once("value", (chatValue) => {
            var chatter = chatValue.val(); 
            console.log("chatter in loign", chatter);
            if (chatter === null) {
                this.sendUserDatabse();
                console.log("data send");
            }else {
                let userArray = [];
                // console.log(chatter);
                for (let key in chatter){
                    // copying data from database to array of object
                    // console.log(chatter[key]);
                    userArray.push(chatter[key]);
                }
                // state update hoo gyi yhan pr
                // console.log(this.state.userList);
                let checkUser = false;
                userArray.map((value, index) => {
                // console.log(value.authorMail);
                    (value.authorMail === this.props.user.email) ? checkUser=true : {}
                })
                if (!checkUser) {
                    userArray.push({
                        author: this.props.user.displayName,
                        authorMail : this.props.user.email,
                        authorPhoto : this.props.user.providerData[0].photoURL,
                        typing: false,
                        online: false
            
                    })
                    this.sendUserDatabse();
                }
                userArray = JSON.stringify(userArray);
                localStorage.setItem('userArray', userArray);
            }  
            // console.log(this.state.userList);
            // window.location.assign("/chat");
        });    
    }


    signIn = ()=> {
        this.setState({loading: true});
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

            //yhan user(left side vala) ek variable jisme user(right vala, ye ek obj hai) string me convert hoke user(left side) me store hoo rha hai
            user = JSON.stringify(user);
            localStorage.setItem('user', user);// yhan localstorage me usse store kr diya ("key", value), value is left vala user.
            // now when we store the variable hum usko parse krate hai jha humne use use krna hai.
            this.setState({loading: false});
            
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
                <div className="background" style={{zIndex: 10}}>
                    <h2 className="chatAppTitle">The ChatApp</h2>
                </div>
                <div className="loginBtn" >
                {this.state.loading ? <div style={{height: "200px", width: "200px", margin: "auto", backgroundRepeat: "no-repeat", "backgroundImage" : "url('http://www.dariusland.com/images/load.gif')", backgroundSize : "contain"}}></div> :
                    this.state.buttonValue=="Sign Out" ? 
                        <div>
                            <div className="userWrapper">
                                <div className="userImage" style={{"backgroundImage" : this.state.userImage}}></div>
                                <div className="userName">
                                    <h2>{this.state.user.displayName}</h2>
                                </div>
                                <button className="goToChatButton" onClick={()=> {window.location.assign("/chat")}}>Go to chat</button>
                                <button className="signInButton" onClick={this.authHandle}><p>{this.state.buttonValue}</p></button>
                            </div>
                        </div>
                         : <div>
                         <button className="signInButton" onClick={this.authHandle}><p>{this.state.buttonValue}</p></button></div>
                }
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