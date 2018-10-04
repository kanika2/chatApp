import React, { Component } from 'react';
import "./css/sideBar.css";

export default class SideBar extends Component {
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
                                <li>{this.props.user.displayName}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="search">
                    <input className="inputSearch" type="text" placeholder="Search"/>
                    <i className="fas fa-search search-icon"></i>
                </div>
                <div className="user">
                    <div className="activeUser row">
                        <div className="col-sm-2">
                            <div className="userPhoto"></div>
                        </div>
                        <div className="col-sm-10">
                            <p>Users</p>
                        </div>
                    </div>
                    <div className="activeUser row">
                        <div className="col-sm-2">
                            <div className="userPhoto"></div>
                        </div>
                        <div className="col-sm-10">
                            <p>Users</p>
                        </div>
                    </div>
                    <div className="activeUser row">
                        <div className="col-sm-2">
                            <div className="userPhoto"></div>
                        </div>
                        <div className="col-sm-10">
                            <p>Users</p>
                        </div>
                    </div>
                    <div className="activeUser row">
                        <div className="col-sm-2">
                            <div className="userPhoto"></div>
                        </div>
                        <div className="col-sm-10">
                            <p>Users</p>
                        </div>
                    </div>
                    <div className="activeUser row">
                        <div className="col-sm-2">
                            <div className="userPhoto"></div>
                        </div>
                        <div className="col-sm-10">
                            <p>Users</p>
                        </div>
                    </div>
                    <div className="activeUser row">
                        <div className="col-sm-2">
                            <div className="userPhoto"></div>
                        </div>
                        <div className="col-sm-10">
                            <p>Users</p>
                        </div>
                    </div>
                    <div className="activeUser row">
                        <div className="col-sm-2">
                            <div className="userPhoto"></div>
                        </div>
                        <div className="col-sm-10">
                            <p>Users</p>
                        </div>
                    </div>
                    <div className="activeUser row">
                        <div className="col-sm-2">
                            <div className="userPhoto"></div>
                        </div>
                        <div className="col-sm-10">
                            <p>Users</p>
                        </div>
                    </div>
                    <div className="activeUser row">
                        <div className="col-sm-2">
                            <div className="userPhoto"></div>
                        </div>
                        <div className="col-sm-10">
                            <p>Users</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}