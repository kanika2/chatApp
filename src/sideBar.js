import React, { Component } from 'react';
import "./css/sideBar.css";

export default class SideBar extends Component {
    render() {
        return(
            <div>
                <div className="nav">
                    <div className="photo"> </div>
                    <ul>
                        <li><i className="fas fa-ellipsis-v "></i></li>
                        <li><i className="fas fa-comment-alt "></i></li>
                    </ul>
                </div>
                <div className="search">
                    <input className="inputSearch" type="text" placeholder="Search"/>
                    <i className="fas fa-search search-icon"></i>
                </div>
                <div className="user">
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                    <div className="activeUser">
                        <div className="userPhoto"></div>
                        <p>Users</p>
                    </div>
                </div>
            </div>
        );
    }
}