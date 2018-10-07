import React, { Component } from 'react';
import "./css/sideBar.css";
import fire from './fire';
import Beforeunload from 'react-beforeunload';

export default class SideBar extends Component {
    constructor(props) {
        let activeUsers = localStorage.getItem("userArray");// ye user jo localstorage me hai use get kiya
        activeUsers = JSON.parse(activeUsers);
        // active user ko parse(object form) kiya nd active user me store krake value update kri uski
        super(props);
        let user = localStorage.getItem('user');
        user = JSON.parse(user);
        console.log(user);
        this.state = {
            userImage: "url('"+user.providerData[0].photoURL+"')",
            userName : user.displayName,
            userKey : "",
            activeUsers,
            database : fire.database(),
        }
        this.readUserDatabase(user);
        this.setOnlineFunc(user);
        // console.log(this.state.userName);
    }

    readUserDatabase = (user)=> {
        console.log('in read user db')
        this.state.database.ref("/Users").on("value", (chatValue) => {
            var chatter = chatValue.val();
            console.log(chatter);
            let activeUsers = [];
            let tempActiveUsers;
            // console.log(chatter);
            for (let key in chatter){
                // copying data from database to array of object
                // console.log(chatter[key]);
                if(chatter[key].author!=undefined) {
                console.log(key);
                tempActiveUsers = chatter[key];
                tempActiveUsers.key = key;
                activeUsers.push(tempActiveUsers);
                }
            }
            this.setState({activeUsers});
            console.log(activeUsers);
        });
      }

      setOnlineFunc = user => {
        this.state.database.ref("/Users").once("value", (chatValue) => {
            var chatter = chatValue.val();
            console.log(chatter);
            let activeUsers = [];
            let tempActiveUsers;
            // console.log(chatter);
            for (let key in chatter){
                // copying data from database to array of object
                // console.log(chatter[key]);
                if(chatter[key].author!=undefined) {
                console.log(key);
                tempActiveUsers = chatter[key];
                tempActiveUsers.key = key;
                activeUsers.push(tempActiveUsers);
                }
            }
            console.log(activeUsers);
                for(var i=0; i<activeUsers.length; i++) {
                    console.log(activeUsers[i].authorMail, user.email)
                    if(activeUsers[i].authorMail==user.email) {
                        if(!activeUsers[i].online) {
                            console.log("bhai tru ho gya");
                            this.state.database.ref("/Users/"+activeUsers[i].key+"/online").set(true);
                            this.setState({userKey: activeUsers[i].key});
                            this.props.setUserKey(activeUsers[i].key);
                            break;
                        }
                        this.setState({userKey: activeUsers[i].key});
                        this.props.setUserKey(activeUsers[i].key);
                    }
                }
        });
      }

      componentDidUpdate() {
          console.log('updated ', this.state.userKey);
      }

      offlineFunc = () => {
        console.log("chl rha h bahi ye to");
        this.state.database.ref("/Users/"+this.state.userKey+"/online").set(false);
      }

    render() {
        let authorPhoto = "";
        return(

      <Beforeunload onBeforeunload={() => {this.offlineFunc();}}>
            <div>
                <div className="nav">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="photo" style={{backgroundImage: this.state.userImage}}></div>
                        </div>
                        <div className="col-sm-8">
                            <ul>
                                <li><p>{this.state.userName}</p></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="search">
                    <input className="inputSearch" type="text" placeholder="Search"/>
                    <i className="fas fa-search search-icon"></i>
                </div>
                <div className="user">
                    {this.state.activeUsers.map((value, index)=>{
                        return(
                            <div key= {index} className="activeUser row">
                                <div className="col-sm-2">
                                    <span style={{display: "none"}}>{value.authorPhoto ? authorPhoto = "url('"+value.authorPhoto+"')" : authorPhoto = 'url("https://www.squ.edu.om/Portals/85/user_icon.png")'}</span>
                                    <div className="userPhoto" style={{backgroundImage: authorPhoto}}></div>
                                    <div className={value.online ? "onlineMark" : "offlineMark"}></div>
                                </div>
                                <div className="col-sm-10">
                                    <p>{value.author}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

      </Beforeunload>
        );
    }
}