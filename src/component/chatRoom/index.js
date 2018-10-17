import React, {Component} from "react";

import "../../css/loginPage.css";
import "./chatRoom.css";
import fire from '../../fire';

export default class ChatRooms extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            chatRoomName: "",
            chatRooms: ["School Masti", "Anant's B'day"],
            database : fire.database(),
            user: {
                providerData: [""]
            },
            allChatRoom: []
        }
    }

    componentDidMount() {
        this.setState({loading: false});
        let user  = localStorage.getItem('user');
        if(user) {
            user = JSON.parse(user);
            console.log(user);
        }
        this.setState({user});
        this.state.database.ref("/chatRooms").once("value", (allChatRoom) => {
            if(!allChatRoom.val())
                allChatRoom = [];
            else 
                allChatRoom = allChatRoom.val();
            this.setState({allChatRoom});
        });
    }

    createChatRoomHandle = ()=> {
        if(this.state.chatRoomName!="") {
            let roomExist = false;
            console.log(this.state);
            this.state.allChatRoom.map((value)=>{
                if(value===this.state.chatRoomName) {
                    roomExist = true;
                }
            });
            if(!roomExist) {
                let newRef = this.state.database.ref("/chatRooms").push(this.state.chatRoomName);
                this.state.database.ref("/chatRooms/"+newRef.key+"/"+this.state.chatRoomName+"/admin").push(this.state.user.email);
            }
            window.location.assign("/chat/"+this.state.chatRoomName);
        }
    }

    render() {
        return (
            <div className="App">
                <div className="background" style={{zIndex: 10}}>
                    <h2 className="chatAppTitle">The ChatApp</h2>
                </div>
                <div className="loginBtn" >

                    <div className="createChatRoomContainer">
                        <div className="inputBoxWrapper">
                            <input type="text" value={this.state.chatRoomName} onChange={(chatRoomName)=>{this.setState({chatRoomName: chatRoomName.target.value})}} placeholder="write chatroom name here..."/>
                        </div>
                        <div className="createButtonWrapper">
                            <button onClick={this.createChatRoomHandle}>Create ChatRoom</button>
                        </div>
                    </div>

                    <div className="chatRoomListContainer">
                        <h4 className="chatRoomTitle">Your Chat Rooms</h4>
                        {this.state.loading ? <div style={{height: "200px", width: "200px", margin: "auto", backgroundRepeat: "no-repeat", "backgroundImage" : "url('http://www.dariusland.com/images/load.gif')", backgroundSize : "contain"}}></div> :
                            <div className="chatRoomList">
                                {
                                 this.state.chatRooms.length == 0 ? <a className="noChatRoom">You are not connected to any chat room yet.</a> :
                                 this.state.chatRooms.map((value)=>{
                                        return (<a href="#" className="chatRoomLink"><i className="fas fa-user-friends"></i>{value}</a>)
                                })
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

}