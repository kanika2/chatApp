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
import moment from 'moment';

var timer;
var timeoutcount;

export default class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message : "",
      display : "",
      messageArray : [],
      user: {
        providerData: [""]
      },
      typingList : [],
      userKey: "",
      activeUserLength: 0,
      readInitial: true,
      typing: false,
      database : fire.database(),
      replyKey: false,
      replyAuthor: "null",
      replyBody: "null"
    }

    document.addEventListener('DOMContentLoaded', function () {
      if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.'); 
        return;
      }
    
      if (Notification.permission !== "granted")
        Notification.requestPermission();
    });

    window.onblur = ()=> {
      console.log('working');
    }
    window.onfocus = () => {
      console.log('working 2');
      this.markReadFunc();
    }
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
    if(sendMessage!="") {
      this.sendMessageDatabase();
    }
  }

  sendMessageDatabase = ()=> {
    // console.log(this.state.user.displayName);
    var message = this.state.message;
    var data = {
        author: this.state.user.displayName,
        body: message,
        deliveredTo: [this.state.user.displayName],
        readBy: [this.state.user.displayName],
        time: moment().toDate().toISOString(),
        embedded: this.state.replyKey,
        embeddedAuthor: this.state.replyAuthor,
        embeddedBody : this.state.replyBody
    }
    this.state.database.ref("/msg").push(data);
    this.setState({replyKey: false});
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
      let keyToUpdateDelivered = [];
      let valueToUpdate = [];
      let dataArray = [];
      var messages = message.val();
      let temp = {};
      for(let key in messages) {
        temp = messages[key];
        temp.deliveredToAll = false;
        temp.readByAll = false;
        temp.key = key;
        dataArray.push(temp);
      }
      console.log(dataArray);
      dataArray.map((value, index)=> {
        let deliveredToCheck = false;
        dataArray[index].date = moment(value.time).toDate().getDate()+"/"+(moment(value.time).toDate().getMonth()+1)+"/"+moment(value.time).toDate().getFullYear();
        dataArray[index].time = ('0' + moment(value.time).toDate().getHours()).slice(-2)+":"+('0' + moment(value.time).toDate().getMinutes()).slice(-2);
        value.deliveredTo.map((data, i) => {
          if(data==this.state.user.displayName) {
            deliveredToCheck = true;
          }
        });
        let newValue = [];
        if(!deliveredToCheck) {
          console.log("delivered updated");
          dataArray[index].deliveredTo.push(this.state.user.displayName);
          newValue = dataArray[index].deliveredTo;
          keyToUpdateDelivered.push(value.key);
          valueToUpdate.push(newValue);
        }
        console.log("d key", keyToUpdateDelivered);
      });
      console.log(this.state);
      dataArray.map((value, index)=>{
        if(value.deliveredTo != undefined) {
          if(value.deliveredTo.length == this.state.activeUserLength) {
            console.log("delivered to all true h re");
            dataArray[index].deliveredToAll = true;
          }
        }
        if(value.readBy != undefined) {
          console.log('readby length', value.readBy.length);
          if(value.readBy.length == this.state.activeUserLength) {
            dataArray[index].readByAll = true;
          }
        }
      })
      console.log(this.state);
      console.log(dataArray);
      this.setState({messageArray : dataArray});
      var elem = document.getElementsByClassName('chatBox');
      elem[0].scrollTop = elem[0].scrollHeight;
      if(!this.state.readInitial) {
        if(dataArray.length!=0) {
        let msgObj = dataArray[dataArray.length-1];
        let check = (msgObj.author).toLowerCase() != (this.state.user.displayName).toLowerCase();
        console.log(check);
        check ? this.notifyMe(msgObj) : {}
      }
    }
    console.log("deliverd key", keyToUpdateDelivered);
    keyToUpdateDelivered.map((value, index)=> {
      console.log("deliver key", value);
      this.state.database.ref("/msg/"+value+"/deliveredTo").set(valueToUpdate[index]);
    });

  });
  this.setState({readInitial: false});
  this.markReadFunc();
  }

  markReadFunc = ()=> {
    this.state.database.ref("/msg").once("value", (message) => {
      let keyToUpdateReadBy = [];
      let valueToUpdate = [];
      let dataArray = [];
      var messages = message.val();
      let temp = {};
      for(let key in messages) {
        temp = messages[key];
        temp.deliveredToAll = false;
        temp.readByAll = false;
        temp.key = key;
        dataArray.push(temp);
      }
      console.log(dataArray);
      dataArray.map((value, index)=> {
        let readByCheck = false;
        value.readBy.map((data, i) => {
          if(data==this.state.user.displayName) {
            readByCheck = true;
          }
        });
        let newValue = [];
        if(!readByCheck) {
          dataArray[index].readBy.push(this.state.user.displayName);
          newValue = dataArray[index].readBy;
          keyToUpdateReadBy.push(value.key);
          valueToUpdate.push(newValue);
          console.log("key to update", value.key);
        }
      });
      console.log(dataArray);
      keyToUpdateReadBy.map((value, index)=> {
        this.state.database.ref("/msg/"+value+"/readBy").set(valueToUpdate[index]);
      });
  });
  }

  setReplyFunc = (author, body)=> {
    this.setState({replyKey: true, replyAuthor: author, replyBody: body});
  }

  setActiveUserLength = length => {
    console.log("length", length);
    this.setState({activeUserLength: length});
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
                <SideBar setUserKey={this.setUserKey} setActiveUserLength={this.setActiveUserLength} />
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
                  <div>
                  {index!=0 ? this.state.messageArray[index-1].date != this.state.messageArray[index].date ? <p className="date"><span>{value.date}</span></p> : <p></p> : <p className="date"><span>{value.date}</span></p>}
                  {value.embedded===false ? 
                  <div className="chatLogWrapper" key={index} style={ (value.author).toLowerCase()===(this.state.user.displayName).toLowerCase() ? {textAlign: "right"} : {textAlign: "left"} }>
                    <div className={ (value.author).toLowerCase()===(this.state.user.displayName).toLowerCase() ? "chatLogAuthor" : "chatLog"} key ={index}>
                      <p className="chatAuthor">{value.author} <button className={(value.author).toLowerCase()===(this.state.user.displayName).toLowerCase() ? "replyButtonRight" : "replyButtonLeft"} onClick={()=>{this.setReplyFunc(value.author, value.body)}}><i class="fas fa-reply"></i></button></p><br/>
                      {value.readByAll ? 
                        <p className="chatMessage">{value.body} {(value.author).toLowerCase() === (this.state.user.displayName).toLowerCase() ? <span className="msgMetaData"><span className="time">{value.time}</span><i className="fas fa-check-double green"></i></span> : <i></i> } </p>
                      :
                        value.deliveredToAll ? 
                        <p className="chatMessage">{value.body} {(value.author).toLowerCase() === (this.state.user.displayName).toLowerCase() ? <span className="msgMetaData"><span className="time">{value.time}</span><i className="fas fa-check-double"></i></span> : <i></i> } </p> 
                        :
                        <p className="chatMessage">{value.body} {(value.author).toLowerCase() === (this.state.user.displayName).toLowerCase() ? <span className="msgMetaData"><span className="time">{value.time}</span><i className="fas fa-check"></i></span> : <i></i> } </p>
                      }
                    </div>
                  </div> : 
                  <div className="chatLogWrapper" key={index} style={ (value.author).toLowerCase()===(this.state.user.displayName).toLowerCase() ? {textAlign: "right"} : {textAlign: "left"} }>
                  <div className={ (value.author).toLowerCase()===(this.state.user.displayName).toLowerCase() ? "chatLogAuthor" : "chatLog"} key ={index}>
                    <p className="chatAuthor">{value.author} <button className={(value.author).toLowerCase()===(this.state.user.displayName).toLowerCase() ? "replyButtonRight" : "replyButtonLeft"} onClick={()=>{this.setReplyFunc(value.author, value.body)}}><i class="fas fa-reply"></i></button></p><br/>
                    <p className="chatMessage">
                    <div className={(value.author).toLowerCase()===(this.state.user.displayName).toLowerCase() ? "embededMsg self" : "embededMsg other"}>
                        <p className="embededAuthor">{value.embeddedAuthor}</p>
                        <p className="embededBody">{value.embeddedBody}</p>
                      </div>
                    {value.readByAll ? 
                      <span>{value.body} {(value.author).toLowerCase() === (this.state.user.displayName).toLowerCase() ? <span className="msgMetaData"><span className="time">{value.time}</span><i className="fas fa-check-double green"></i></span> : <i></i> } </span>
                    :
                      value.deliveredToAll ? 
                      <span>{value.body} {(value.author).toLowerCase() === (this.state.user.displayName).toLowerCase() ? <span className="msgMetaData"><span className="time">{value.time}</span><i className="fas fa-check-double"></i></span> : <i></i> } </span> 
                      :
                      <span>{value.body} {(value.author).toLowerCase() === (this.state.user.displayName).toLowerCase() ? <span className="msgMetaData"><span className="time">{value.time}</span><i className="fas fa-check"></i></span> : <i></i> } </span>
                    }
                    </p>
                  </div>
                </div>
                  }
                  </div>
                );
              })}
              </div>
              <div className="writeMessage">
              {this.state.replyKey ? 
              <div>
              <p className="closeReply"><button onClick={()=>{this.setState({replyKey: false})}}><i className="fas fa-times"></i></button></p>
                <div className="chatLogWrapper" style={ (this.state.replyAuthor).toLowerCase()===(this.state.user.displayName).toLowerCase() ? {textAlign: "right"} : {textAlign: "left"} }>
                  <div className={(this.state.replyAuthor).toLowerCase() === (this.state.user.displayName).toLowerCase() ? "chatLogAuthor" : "chatLog"}>
                    <p className="chatAuthor">{this.state.replyAuthor}</p><br/>
                      <p className="chatMessage">{this.state.replyBody}</p>
                  </div>
                </div>
                </div>
              : <p></p>}
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