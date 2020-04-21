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

      newPhotoId: 2500,   //id of new photos start from 2500
      newCommentId: 4500, //id of new comments start from 4500

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
    this.addNewComment=this.addNewComment.bind(this);
    this.getCurrentUser=this.getCurrentUser.bind(this);
    this.getUsersStr=this.getUsersStr.bind(this);
    this.updatePhotoObj=this.updatePhotoObj.bind(this);
    this.lookupPhoto=this.lookupPhoto.bind(this);
    this.getCommentsStr=this.getCommentsStr.bind(this);
    this.getPhotosStr=this.getPhotosStr.bind(this);
    this.getUserPhotos=this.getUserPhotos.bind(this);

    this.allocCommentId=this.allocCommentId.bind(this);
    this.allocPhotoId=this.allocPhotoId.bind(this);

  }


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

  addNewComment( newComment, photo, source ) {

    let id=this.allocCommentId();

    let newCommentObj = {
      "id": id,
      "comment": newComment,
      "photo":  photo,
      "source": source      
    }
    let newCommentList = this.state.comments;
    newCommentList.push(newCommentObj);
    this.setState( { comments : newCommentList  });

    return JSON.stringify(newCommentObj);

  }

  allocCommentId() {
    let id=this.state.newCommentId;
    this.state.newCommentId += 1;
    return id;
  }
  allocPhotoId() {
    let id=this.state.newPhotoId;
    this.state.newCommentId += 1;
    return id;
  }

  getCurrentUser() {
    return JSON.stringify(this.state.currentUser);
  }

  lookupPhoto (photoId) {

    for (let i=0; i<this.state.photos.length; i++) {
      if (this.state.photos[i].id===photoId) {
        return JSON.stringify(this.state.photos[i]);
      } 
    }
    return null;
  }
  getCommentsStr() {
    return JSON.stringify(this.state.comments);
  }
  getUsersStr() {
    return JSON.stringify(this.state.users);
  }
  getPhotosStr() {
    return JSON.stringify(this.state.photos);
  }

  getUserPhotos(userId) {
    let photoList=[];  //return a list of photo id owned by the user
    for (let i=0; i<this.state.photos.length; i++) {
      if (this.state.photos[i].owner === userId) {
        photoList.push(this.state.photos[i].id)
      }
    }

    return JSON.stringify(photoList);
  }

  updatePhotoObj (photoObjStr) {

    let photoObj = JSON.parse(photoObjStr);

    let newPhotoList = this.state.photos;
    for (let i=0; i<newPhotoList.length; i++) {
      if (photoObj.id === newPhotoList[i].id) {

        //update photo object
        newPhotoList.splice( i, 1, photoObj);

        this.setState( {photos : newPhotoList} )

        break;
      }
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
                      swapDisplayCallback:     this.swapContainerOnDisplay,
                      addNewCommentCallback:   this.addNewComment,
                      getCurrentUserCallback:  this.getCurrentUser,
                      updatePhotoObjCallback:  this.updatePhotoObj,
                      lookupPhotoCallback:     this.lookupPhoto,
                      getCommentsStrCallback:  this.getCommentsStr,
                      getPhotosStrCallback:    this.getPhotosStr
                  }}>Home</Link>
                </li>

                <li>
                  <Link to={{
                    pathname:                 "/Bookmarks",
                      fromContainer:           this.state.containerOnDisplay,

                      lookupUserCallback:      this.lookupUser,
                      swapDisplayCallback:     this.swapContainerOnDisplay,
                      getCurrentUserCallback:  this.getCurrentUser,
                      lookupPhotoCallback:     this.lookupPhoto,
                  }}>Bookmarks</Link>
                </li>
                <li>
                  <Link to={{
                    pathname:                 "/Profile",
                      fromContainer:           this.state.containerOnDisplay,

                      lookupUserCallback:      this.lookupUser,
                      swapDisplayCallback:     this.swapContainerOnDisplay,
                      getCurrentUserCallback:  this.getCurrentUser,
                      lookupPhotoCallback:     this.lookupPhoto,
                      getUserPhotosCallback:   this.getUserPhotos
                  }}>Profile</Link>
                </li>
                <li>
                  <Link to={{
                    pathname: "/Login",
                    authenticateUserCallBack: this.authenticateUser,
                    swapDisplayCallback:      this.swapContainerOnDisplay,
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
          addNewCommentCallback = {this.addNewComment}
          getCurrentUserCallback = {this.getCurrentUser}
          updatePhotoObjCallback = {this.updatePhotoObj}
          lookupPhotoCallback = {this.lookupPhoto}
          getCommentsStrCallback = {this.getCommentsStr}
          getPhotosStrCallback = {this.getPhotosStr}
        />

      </div>
  )}
}