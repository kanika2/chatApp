import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from "./actionType/action";

//import logo from './logo.svg';
//import './css/App.css';
import './css/chat.css';
//import Chat_app from './header';
import fire from './fire';
import TextField from '@material-ui/core/TextField';
import SideBar from "./sideBar";

var timer;
var timeoutcount;

export default class ChatApp extends Component {
  constructor(props) {
    super(props);
    // console.log();
    this.state = {
      message : "",
      display : "",
      messageArray : [],
      user: {
        providerData: [""]
      },
      typingList : [],
      userKey: "",
      readInitial: true,
      typing: false,
      database : fire.database(),
    }

    document.addEventListener('DOMContentLoaded', function () {
      if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.'); 
        return;
      }
    
      if (Notification.permission !== "granted")
        Notification.requestPermission();
    });
  }

  componentDidMount() {
    this.readMessage();
    this.typingStatusCheck();
    window.addEventListener("beforeunload", this.onUnload)
    console.log("added event listener")
    // console.log(this.props);
    let user  = localStorage.getItem('user');
    if(user) {
      user = JSON.parse(user);
      console.log(user);
    }
    this.setState({user});

    //console.log("did mount");
  }

  onUnload(event) { // the method that will be used for both add and remove event
      console.log("hellooww")
      event.returnValue = "Hellooww"
  }

  notifyMe = (msg)=> {
    if (Notification.permission !== "granted")
      Notification.requestPermission();
    else {
      var notification = new Notification('The ChatApp', {
        icon: 'http://shonari.net/wp-content/uploads/2014/05/facebook-messenger-icon.png',
        body: (msg.author).replace(/\b\w/g, l => l.toUpperCase())+": "+msg.body,
      });
  
      notification.onclick = function () {
        window.open("http://localhost:3000/chat");      
      };
  
    }
  
  }

  setUserKey = (userKey) => {
    console.log("in set user key , app", userKey);
    this.setState({userKey});
  }

  handlechange= e => {
    let input = e.target.value;
    //console.log(input);
    this.setState({message : input});

  }

  sendButton = ()=> {
    let sendMessage  = this.state.message;
    console.log(sendMessage);
    this.setState({message:""})
    this.sendMessageDatabase();
  }

  sendMessageDatabase = ()=> {
    // console.log(this.state.user.displayName);
    var message = this.state.message;
    var data = {
        author: this.state.user.displayName,
        body: message
    }
    this.state.database.ref("/msg").push(data);
  }

  typingStatusUpdate = (checkTyping) => {
    console.log(checkTyping);
    if(checkTyping) {
       if(timer) {
         clearTimeout(timeoutcount);
       }
      timer = false;
      this.state.database.ref("/Users/"+this.state.userKey+"/typing").set(true);
     } else {
       if(!timer) {
        timer = true;
       }
       timeoutcount = setTimeout(()=>{this.state.database.ref("/Users/"+this.state.userKey+"/typing").set(false);}, 2000);
     }
  }
  typingStatusCheck = ()=> {
      this.state.database.ref("/Users").on("value", (status) => {
        let userList = status.val();
        let typingList = [];
        for (let key in userList){
            if(userList[key].author!=undefined) {
              if(userList[key].authorMail != this.state.user.email ) {
                if(userList[key].typing) {
                  typingList.push(userList[key].author);
                }
              }
          }
      }
      console.log(typingList);
      this.setState({typingList});
    });
  }

  readMessage = ()=> {
    this.state.database.ref("/msg").on("value", (message) => {
      let dataArray = [];
      var messages = message.val();
      for(let key in messages) {
        dataArray.push(messages[key]);
      }
      this.setState({messageArray : dataArray});
      var elem = document.getElementsByClassName('chatBox');
      elem[0].scrollTop = elem[0].scrollHeight;
      if(!this.state.readInitial) {
        let msgObj = dataArray[dataArray.length-1];
        let check = (msgObj.author).toLowerCase() != (this.state.user.displayName).toLowerCase();
        console.log(check);
        check ? this.notifyMe(msgObj) : {}
      }
  });
  this.setState({readInitial: false});
  }

  

  render() {
    return (
      <div className="App">
        <div className="background">
              <h2 className="chatAppTitle">The ChatApp</h2>
        </div>
        <div className="container-fluid">
          <div className="chat row">
            <div className="leftSide col-sm-3">
              <div className="sidebarWrapper">
                {/* {console.log(this.state.user)} */}
                <SideBar setUserKey={this.setUserKey} />
              </div>
            </div>
            <div className="chattingArea col-sm-9">
            <div className="chatBar">
              <ul>
                { this.state.typingList.length != 0 ?
                  this.state.typingList.length > 1 ?
                  <li className="typingStatus">
                  {this.state.typingList.map((value, index)=>{return <span>{value}{this.state.typingList.length == index+1 ? <span></span> : <span>,</span> }  </span>})} are typing...</li>
                  : <li className="typingStatus"><span>{this.state.typingList[0]} is typing...</span></li>
                : <li></li>
                }
                {/* <li><i className="fas fa-ellipsis-v"></i></li>
                <li><i className="fas fa-comment-alt"></i></li>
                <li><i className="fas fa-paperclip"></i></li> */}
                <li className="logoutButton"><button onClick={()=>{window.location.assign("/")}}>Leave Chat</button></li>
              </ul>
            </div>
              <div className="chatBox">{this.state.messageArray.map((value, index) => {
                return (
                  <div className="chatLogWrapper" key={index} style={ (value.author).toLowerCase()===(this.state.user.displayName).toLowerCase() ? {textAlign: "right"} : {textAlign: "left"} }>
                    <div className={ (value.author).toLowerCase()===(this.state.user.displayName).toLowerCase() ? "chatLogAuthor" : "chatLog"} key ={index}>
                      <p className="chatAuthor">{value.author}</p><br/>
                      <p className="chatMessage">{value.body}</p>
                    </div>
                  </div>
                );
              })}
              </div>
              <div className="writeMessage">
                <input className="text"  onKeyDown={()=>{this.typingStatusUpdate(true)}} onKeyUp={()=>{this.typingStatusUpdate(false)}} placeholder="Write Your Text" type="text" onChange = {this.handlechange} onKeyDown={()=>{this.typingStatusUpdate(true)}} value={this.state.message}/>
                <i className="fas fa-grin-hearts hearts"></i>
                <i  onClick = {this.sendButton } className="fas fa-location-arrow send"></i>
                {/* <button onClick = {this.sendButton }></button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state) => {
//   console.log(state);
//   return {
//     user : state.auth.user
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   console.log("dispatch");
//   return {
//     login : (user)=> {dispatch ({type: actionTypes.loggedIn, payload: user})},
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);