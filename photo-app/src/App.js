import React, { Component, useState } from 'react';
import './App.css';
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";

import photoImages from './components/ImageDB';
import photoData from './components/EntityDB';
import {userData, commentData} from './components/EntityDB';

import Bookmarks from './components/Bookmarks';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';

import Comments from './components/Comments';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state={
      images: photoImages,
      photos: photoData,
      users: userData,
      comments: commentData,

      currentUser: {},

      currentUserId: "",

      containerOnDisplay: "homeContainer"
    }

    this.lookupUser=this.lookupUser.bind(this);
    this.authenticateUser=this.authenticateUser.bind(this);
    this.navBar=this.navBar.bind(this);
    this.handleLogout=this.handleLogout.bind(this);
    this.updateUserData=this.updateUserData.bind(this);
    
    this.setContainerOnDisplay=this.setContainerOnDisplay.bind(this);
    this.swapContainerOnDisplay=this.swapContainerOnDisplay.bind(this);

  }
  
// componentDidMount() {
//   this.getWineAPI();
// }


/***************************Code for Photo App starts here***************************** */

  lookupUser(id) {
    for (let i=0; i<this.state.users.length; i++) {
      if (this.state.users[i].id===id) {
        return this.state.users[i] ;
      } 
    }
    return null;
  }

  setContainerOnDisplay(container) {   //Do not cause render
    this.state.containerOnDisplay = container;   
  }


  swapContainerOnDisplay(toContainerId, inputProps) {   
        
    //turn on display of "from container" in props. display "to container" instead

    if (inputProps.location === undefined) { 
      //Came in from direct React component call instead of Router. No need to swap display

      this.setContainerOnDisplay(toContainerId); //just save the to container and return
      return;
    }

    let fromContainerId=this.state.containerOnDisplay;
    let fromContainerElem=null;
    if (fromContainerId !== ""  &&  fromContainerId !== toContainerId) {
        fromContainerElem = document.getElementById(fromContainerId);
        if (fromContainerElem !== null) {

            document.getElementById(fromContainerId).style.display="none";
        }
    }

    //display to container
    let toContainerElem=document.getElementById(toContainerId);
    if (toContainerElem === null) {

      return;   //cannot find to container

    } else {
      
      //display to container
      document.getElementById(toContainerId).style.display="";
      this.setContainerOnDisplay(toContainerId); //save the to container 

    }
  }


  authenticateUser(userCredentialStr) {

    let userCredential=JSON.parse(userCredentialStr);
    let userObj={};
    for (let i=0; i<this.state.users.length; i++) {
      if (this.state.users[i].userId===userCredential.username) {
        userObj=this.state.users[i] ;
        break;
      } 
    };

    if (userObj==={}) {
      return false;
    }

    if (userObj.password===userCredential.password) {

      //update current user
      this.setState( {currentUser : userObj });
      this.setState(  {currentUserId : userObj.userId});

      return true;
    } else {
      return false;
    }
  }

  navBar() {
    return (
      <div>
        <Router>
            <nav className="menu">
              <ul className="menuBar">
                <li>
                  <Link to={{
                    pathname:                 "/Home",
                      currentUserStr:          JSON.stringify(this.state.currentUser),
                      photoListStr:            JSON.stringify(this.state.photos),
                      commentListStr:          JSON.stringify(this.state.comments),
                      fromContainer:           this.state.containerOnDisplay,

                      lookupUserCallback:      this.lookupUser,
                      updateUserDataCallback:  this.updateUserData,
                      swapDisplayCallback:     this.swapContainerOnDisplay
                  }}>Home</Link>
                </li>
                <li>
                  <Link to="/Bookmarks">Bookmarks</Link>
                </li>
                <li>
                  <Link to="/Profile">Profile</Link>
                </li>
                <li>
                  <Link to={{
                    pathname: "/Login",
                    authenticateUserCallBack: this.authenticateUser,
                    swapDisplayCallback:      this.swapContainerOnDisplay
                  }}>Login</Link>
                </li>
                <li>
                  <Link onClick={this.handleLogout}>Logout</Link>
                </li>
              </ul>

                <p className="currentUserId">{this.state.currentUserId}</p>
            </nav>

            <h2 className="logoLine">Enjoyable Moments</h2>

            <Switch>
              <Route path="/Home" component={Home} />

              <Route path="/Bookmarks" component={Bookmarks} />

              <Route path="/Login" component={Login} />

              <Route path="/Profile" component={Profile} />

            </Switch>
        </Router>
      </div>
    )
  }

  handleLogout(){
    if (this.state.currentUserId !== "") {

      this.setState( {currentUserId : ""} );
      this.setState( {currentUser   : {}} );

    }
  }

  updateUserData(userStr) {
    
    let userObj=JSON.parse(userStr);
    this.setState( {currentUser : userObj} );
    
  }

  render() {

    return (
      <div>

        {this.navBar()}
    
        <Home 
          pathname = "/Home"
          currentUserStr  = {JSON.stringify(this.state.currentUser)}
          photoListStr    = {JSON.stringify(this.state.photos)}
          commentListStr  = {JSON.stringify(this.state.comments)}
          fromContainer   = {this.state.containerOnDisplay}

          lookupUserCallback = {this.lookupUser}
          updateUserDataCallback = {this.updateUserData}
          swapDisplayCallback = {this.swapContainerOnDisplay}
        />

      </div>
  )}
}