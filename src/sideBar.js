import React, { Component } from 'react';
import "./css/sideBar.css";

export default class SideBar extends Component {
    constructor(props) {
        let activeUsers = localStorage.getItem("userArray");// ye user jo localstorage me hai use get kiya
        activeUsers = JSON.parse(activeUsers);
        // active user ko parse(object form) kiya nd active user me store krake value update kri uski
        super(props);
        this.state = {
            userName : this.props.user.displayName,
            activeUsers,
        }
        // console.log(this.state.userName);
    }


    render() {

        return(
            <div>
                <div className="nav">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="photo"> </div>
                        </div>
                        <div className="col-sm-8">
                            <ul>
                                <li>{this.state.userName}</li>
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
                                    <div className="userPhoto"></div>
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