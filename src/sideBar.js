import React, { Component } from 'react';
import "./css/sideBar.css";

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
            activeUsers,
        }
        // console.log(this.state.userName);
    }

    render() {
        let authorPhoto = "";
        return(
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
                                </div>
                                <div className="col-sm-10">
                                    <p>{value.author}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}