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


export default class ChatApp extends Component {
  constructor(props) {
    super(props);
    console.log();
    this.state = {
      message : "",
      display : "",
      messageArray : [],
      user: "",
      database : fire.database()
    }
  }

  componentDidMount() {
    this.readMessage();
    console.log(this.props);
    let user  = localStorage.getItem('user');
    if(user) {
      user = JSON.parse(user);
    }
    this.setState(user);
    console.log(user);
    // console.log("user: ", user);
    //console.log("did mount");
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
    var message = this.state.message;
    var data = {
        author: this.state.user.displayName,
        body: message
    }
    this.state.database.ref("/msg").push(data);
}

  readMessage = ()=> {
    let dataArray = []
    this.state.database.ref("/msg").on("value", (message) => {
      var messages = message.val();
      for(let key in messages) {
        dataArray.push(messages[key]);
      }
      this.setState({messageArray : dataArray})
  });
}

  render() {
    return (
      <div className="App" >
        <div className="background"></div>
        <div className="container-fluid">
          <div className="chat row">
            <div className="leftSide col-sm-3">
              <div>
                <SideBar/>
              </div>
            </div>
            <div className="chattingArea col-sm-9">
            <div className="chatBar">
              <ul>
                <li><i className="fas fa-ellipsis-v"></i></li>
                <li><i className="fas fa-comment-alt"></i></li>
                <li><i className="fas fa-paperclip"></i></li>
              </ul>
            </div>
              <div className="chatBox">{this.state.messageArray.map((value, index) => {
                return (
                  <div className="chatLog" key ={index}>
                    <p className="chatAuthor">{value.author}</p><br/>
                    <p className="chatMessage">{value.body}</p>
                  </div>
                );
              })}
              </div>
              <div className="writeMessage">
                <i className="fas fa-grin-hearts hearts"></i>
                <i  onClick = {this.sendButton } className="fas fa-location-arrow send"></i>
                <input className="text"  placeholder="Write Your Text" type="text" onChange = {this.handlechange} value={this.state.message}/>
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