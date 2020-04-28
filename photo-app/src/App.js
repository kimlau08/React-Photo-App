import React, { Component, useState } from 'react';
import './style/App.css';
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";

import photoImages from './components/ImageDB';
import photoData from './components/EntityDB';
import {userData, commentData} from './components/EntityDB';

import Bookmarks from './components/Bookmarks';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout'
import Profile from './components/Profile';

const result = {
  success: 1,
  notLoggedIn: -1,
  alreadyLiked: -2,
  alreadyDisliked: -3,
  alreadyBookmarked: -4,
  notPhotoOwner: -5
} 

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

      images: photoImages,
      
      currentUser: {},
      currentUserId: "",

      containerOnDisplay: "homeContainer"
    }

    this.lookupUser=this.lookupUser.bind(this);
    this.lookupUserId=this.lookupUserId.bind(this);
    this.authenticateUser=this.authenticateUser.bind(this);
    this.logoutUser=this.logoutUser.bind(this);
    this.navBar=this.navBar.bind(this);
    this.handleLogout=this.handleLogout.bind(this);
    this.updateUserData=this.updateUserData.bind(this);
    
    this.setContainerOnDisplay=this.setContainerOnDisplay.bind(this);
    this.swapContainerOnDisplay=this.swapContainerOnDisplay.bind(this);
    this.addNewComment=this.addNewComment.bind(this);
    this.deleteComment=this.deleteComment.bind(this);
    this.getCurrentUser=this.getCurrentUser.bind(this);
    this.setCurrentUser=this.setCurrentUser.bind(this);
    this.deleteCurrentUser=this.deleteCurrentUser.bind(this);
    this.getUsersStr=this.getUsersStr.bind(this);
    this.updatePhotoObj=this.updatePhotoObj.bind(this);
    this.updatePhoto=this.updatePhoto.bind(this);
    this.lookupPhoto=this.lookupPhoto.bind(this);
    this.findPhotoIdx=this.findPhotoIdx.bind(this);
    this.findUserIdx=this.findUserIdx.bind(this);
    this.findCommentIdx=this.findCommentIdx.bind(this);
    this.getCommentsStr=this.getCommentsStr.bind(this);
    this.getPhotosStr=this.getPhotosStr.bind(this);
    this.getUserPhotos=this.getUserPhotos.bind(this);

    this.addPhotoLike=this.addPhotoLike.bind(this);
    this.addPhotoDislike=this.addPhotoDislike.bind(this);
    this.addPhotoBookmark=this.addPhotoBookmark.bind(this);
    this.deletePhoto=this.deletePhoto.bind(this);
    this.removeAllLikes=this.removeAllLikes.bind(this);
    this.removeAllDislikes=this.removeAllDislikes.bind(this);
    this.removeAllBookmarks=this.removeAllBookmarks.bind(this);

    this.allocCommentId=this.allocCommentId.bind(this);
    this.allocPhotoId=this.allocPhotoId.bind(this);

  }


  lookupUserId(userId) {

    return this.state.users.find( u => u.userId === userId );  //return user object with matching userId

  }
  lookupUser(id) {
    for (let i=0; i<this.state.users.length; i++) {
      if (this.state.users[i].id.toString()===id.toString()) {
        return this.state.users[i] ;
      } 
    }
    return null;
  }

  setContainerOnDisplay(container) {   //Do not cause render
    this.state.containerOnDisplay = container;   
  }

  hideCommentBox() {
    let containerElem = document.getElementById("commentsContainer");
    if (containerElem !== null) {
        containerElem.style.zIndex = -100;
    }
  }

  userDidLike(user, photoId) {
    return ( user.likePhoto.findIndex( id => id.toString() === photoId.toString() ) >= 0 ); 
  }
  userDidDislike(user, photoId) {
    return ( user.dislikePhoto.findIndex( id => id.toString() === photoId.toString() ) >= 0 ); 
  }
  userDidBookmark(user, photoId) {
    return ( user.bookmarkedPhoto.findIndex( id => id.toString() === photoId.toString() ) >= 0 );
  }
  isPhotoOwner(user, photoId) {
    let photoObj=this.state.photos.find( p => p.id.toString() === photoId.toString() );
    return ( photoObj.owner.toString() === user.id.toString() )
  }
  removeDislike(user, photoId) {
    let photoIdx = user.dislikePhoto.findIndex(  id => id.toString() === photoId.toString() );
    if (photoIdx < 0) {
      return; //photo not on list
    }
    user.dislikePhoto.splice(photoIdx, 1);  //delete from dislike list
    return user
  }
  removeBookmark(user, photoId) {
    let photoIdx = user.bookmarkedPhoto.findIndex(  id => id.toString() === photoId.toString() );
    if (photoIdx < 0) {
      return; //photo not on list
    }
    user.bookmarkedPhoto.splice(photoIdx, 1);  //delete from dislike list
    return user

  }
  removeLike(user, photoId) {
    let photoIdx = user.likePhoto.findIndex( id => id.toString() === photoId.toString() );
    if (photoIdx < 0) {
      return; //photo not on list
    }
    user.likePhoto.splice(photoIdx, 1); //delete from like list
    return user
  }
  removeAllLikes(photoId) {
    let userList=this.state.users;
    userList.map(  u => this.removeLike(u, photoId) );
    this.setState(  {users : userList} );
  }
  removeAllDislikes(photoId) {
    let userList=this.state.users;
    userList.map(  u => this.removeDislike(u, photoId) );
    this.setState(  {users : userList} );
  }
  removeAllBookmarks(photoId) {
    let userList=this.state.users;
    userList.map(  u => this.removeBookmark(u, photoId) );
    this.setState(  {users : userList} );
  }

  addPhotoLike(photoId) {

    let user = this.state.currentUser;
    if (JSON.stringify(user) === JSON.stringify({}) ) {
      return result.notLoggedIn;  //user not logged in. no current user
    }

    if (this.userDidLike(user, photoId)) {
      return result.alreadyLiked; //use already like
    } 

    if (this.userDidDislike(user, photoId)) {      
      //decrement dislike, before incrementing like
      this.updatePhoto(photoId, this.decrementDislikes);

      user = this.removeDislike(user, photoId);  //remove from user's dislike list
   }

    this.updatePhoto(photoId, this.incrementLikes);

    //append like to user and update list
    user.likePhoto.push(Number(photoId));

    //update user list
    let userList = this.state.users;
    let userIdx = userList.findIndex( u => u.id.toString() === user.id.toString() );
    userList.splice(userIdx, 1, user);

    return result.success;  //successful update

  }

  addPhotoDislike(photoId) {

    let user = this.state.currentUser;
    if (JSON.stringify(user) === JSON.stringify({}) ) {
      return result.notLoggedIn;  
    }

    if (this.userDidDislike(user, photoId)) {
      return result.alreadyDisliked; //use already like
    }

    if (this.userDidLike(user, photoId)) {
      //decrement like, before incrementing dislike
      this.updatePhoto(photoId, this.decrementLikes);

      user=this.removeLike(user, photoId); //remove from user's like list
    } 

    this.updatePhoto(photoId, this.incrementDislikes);

    //append disklike to user and update list
    user.dislikePhoto.push(Number(photoId));

    //update user list
    let userList = this.state.users;
    let userIdx = userList.findIndex( u => u.id.toString() === user.id.toString() );
    userList.splice(userIdx, 1, user);

    return result.success;  //successful update

  }
  addPhotoBookmark(photoId) {

    let user = this.state.currentUser;
    if (JSON.stringify(user) === JSON.stringify({}) ) {
      return result.notLoggedIn;  //user not logged in. no current user
    }

    if (this.userDidBookmark(user, photoId)) {
      return result.alreadyBookmarked; //use already like
    } 

    //append like to user and update list
    user.bookmarkedPhoto.push(Number(photoId));

    //update user list
    let userList = this.state.users;
    let userIdx = userList.findIndex( u => u.id.toString() === user.id.toString() );
    userList.splice(userIdx, 1, user);

    return result.success;  //successful update

  }
  deletePhoto(photoId) {

    let user = this.state.currentUser;
    if (JSON.stringify(user) === JSON.stringify({}) ) {
      return result.notLoggedIn;  //user not logged in. no current user
    }

    if ( ! this.isPhotoOwner(user, photoId) )  {
      return result.notPhotoOwner; //user does not own photo
    }

    //delete photo from users' likes
    this.removeAllLikes(photoId);
    //delete photo from users' dislikes
    this.removeAllDislikes(photoId);
    //delete photo from users' bookmarks
    this.removeAllBookmarks(photoId);

    //delete photo from list
    let photoList=this.state.photos;
    let photoIdx=photoList.findIndex( p => p.id.toString() === photoId.toString() )
    photoList.splice(photoIdx, 1);

    this.setState(  {photos: photoList} );

  }

  deleteCurrentUser() {

    let user = this.state.currentUser;
    let userIdx = this.state.users.findIndex( u => u.id === user.id );
    if (userIdx < 0) {
      return;   //no such user
    }
    
    //delete all photos owned by user.
    let photoList=this.state.photos;
    photoList.map( p => { if (p.owner.toString() === user.id.toString() ) {
                             this.deletePhoto(p.id);
                          } } );


    //delete the user.
    let userList = this.state.users;
    userList.splice(userIdx, 1);
  
    this.setState(  {users: userList}  );

    this.logoutUser();
  }


  swapContainerOnDisplay(toContainerId, inputProps) {   
        
    //turn on display of "from container" in props. display "to container" instead

    if (inputProps.location === undefined) { 
      //Came in from direct React component call instead of Router. No need to swap display

      this.setContainerOnDisplay(toContainerId); //just save the to container and return
      return;
    }

    this.hideCommentBox();

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
      document.getElementById(toContainerId).style.position="relative";  //to ensure the position is set, and fix the problem of modal continues showing on other components
      this.setContainerOnDisplay(toContainerId); //save the to container 

    }
  }

  logoutUser() {
    
    if (this.state.currentUserId !== "") {

      this.setState( {currentUserId : ""} );
      this.setState( {currentUser   : {}} );

    }
  }

  authenticateUser(userCredentialStr) {

    let userCredential=JSON.parse(userCredentialStr);
    let userObj={};
    for (let i=0; i<this.state.users.length; i++) {
      if (this.state.users[i].userId.toString()===userCredential.username.toString()) {
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

  incrementLikes( photoObj ) {
    let p = photoObj;
    p.likes += 1;
    return p;
  }
  decrementLikes( photoObj ) {
    let p = photoObj;
    p.likes -= 1;
    return p;
  }
  incrementDislikes( photoObj ) {
    let p = photoObj;
    p.dislikes += 1;
    return p;
  }
  decrementDislikes( photoObj ) {
    let p = photoObj;
    p.dislikes -= 1;
    return p;
  }

  updatePhoto(photoId, updateOpr) {

    //find the photo object
    let photoList = this.state.photos;
    let photoIdx = photoList.findIndex( p => p.id.toString() === photoId.toString() )
    if (photoIdx < 0) {
      return;   //no such photo
    }
    let photoObj = photoList[photoIdx];

    //apply update. can be incr or decr
    photoObj = updateOpr(photoObj);

    //update photo in the list
    photoList.splice(photoIdx, 1, photoObj);
    this.setState( {photos : photoList} )

  }

  deleteComment(commentId, photoId) {

    //delete comment in list
    let commentList = this.state.comments;
    let commentIdx = commentList.findIndex( c => c.id.toString() === commentId.toString() );

    if ( commentList[commentIdx].source.toString() !== this.state.currentUser.id.toString() ) {
      alert ( `The source of the comment is another user` )

      return;
    }

    commentList.splice(commentIdx, 1);

    this.setState( {comments: commentList} );

    //locate photo from list
    let photoList = this.state.photos;
    let photoIdx = photoList.findIndex( p => p.id.toString() === photoId.toString() );

    //delete photo comment list
    let photoObj = this.state.photos[photoIdx];
    let idx = photoObj.comments.findIndex( c => c.toString() === commentId.toString() );
    photoObj.comments.splice(idx, 1)

    //update photo in list
    photoList.splice(photoIdx, 1, photoObj);

    this.setState( {photos : photoList} );
  }

  addNewComment( newComment, photo, source ) {

    let id=this.allocCommentId();

    //create new comment obj
    let newCommentObj = {
      "id": id,
      "comment": newComment,
      "photo":  photo,
      "source": source      
    }

    //add to comment list
    let newCommentList = this.state.comments;
    newCommentList.push(newCommentObj);
    this.setState( { comments : newCommentList  });

    //add comment to photo
    let photoList = this.state.photos;
    let photoIdx = photoList.findIndex( p => p.id.toString() === photo.toString() );
    if (photoIdx < 0) {
      console.error( `photo not found. id: ${photo}` )
      return ""
    }

    let photoObj = this.state.photos[photoIdx];
    photoObj.comments.push( newComment );

    //update photo list
    photoList.splice( photoIdx, 1, photoObj );

    this.setState( {photos : photoList} );

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

  setCurrentUser(userStr) {

    let userObj = JSON.parse(userStr);
    let userId = userObj.userId;

    this.setState( { currentUser: userObj  } )
    this.setState( { currentUserId: userId  } );

  }
  
  findIdx( array, id) {
    for (let i=0; i<array.length; i++) {
      if (array[i].id.toString()===id.toString()) {
        return i;
      } 
    }
    return -1;
  }

  findPhotoIdx (photoId) {

    return this.findIdx(this.state.photos, photoId)
  }
  findUserIdx (userId) {
    
    return this.findIdx(this.state.users, userId)
  }
  findCommentIdx (commentId) {

    return this.findIdx(this.state.comments, commentId)
  }
  lookupPhoto (photoId) {

    for (let i=0; i<this.state.photos.length; i++) {
      if (this.state.photos[i].id.toString()===photoId.toString()) {
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

    //update photo object
    let photoObj = JSON.parse(photoObjStr);
    let newPhotoList = this.state.photos;
    let idx = newPhotoList.findIndex( p => p.id.toString() === photoObj.id.toString() )
    if (idx < 0) {
      return;  //no such photo
    }
    newPhotoList.splice( idx, 1, photoObj);

    this.setState( {photos : newPhotoList} )

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
                      addPhotoLikeCallback:    this.addPhotoLike,
                      addPhotoDislikeCallback: this.addPhotoDislike,
                      addPhotoBookmarkCallback: this.addPhotoBookmark,
                      deletePhotoCallback:     this.deletePhoto,
                      deleteCommentCallback:   this.deleteComment,
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
                      getCurrentUserCallback:  this.getCurrentUser,                      deleteUserCallback:      this.deleteCurrentUser,
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
                  <Link to={{
                    pathname: "/Logout",
                    logoutUserCallback:       this.logoutUser,
                    swapDisplayCallback:      this.swapContainerOnDisplay,
                  }}>Logout</Link>
                </li>
              </ul>

                <p className="currentUserId">{this.state.currentUserId}</p>
            </nav>

            <h2 className="logoLine">Enjoyable Moments</h2>

            <Switch>
              <Route path="/Home" component={Home} />

              <Route path="/Bookmarks" component={Bookmarks} />

              <Route path="/Login" component={Login} />

              <Route path="/Logout" component={Logout} />

              <Route path="/Profile" component={Profile} />

            </Switch>
        </Router>
      </div>
    )
  }

  handleLogout(){

    this.hideCommentBox();

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
          addPhotoLikeCallback  =  {this.addPhotoLike}
          addPhotoDislikeCallback = {this.addPhotoDislike}
          addPhotoBookmarkCallback= {this.addPhotoBookmark}
          deletePhotoCallback=      {this.deletePhoto}
          deleteCommentCallback =  {this.deleteComment}
          deleteUserCallback = {this.deleteCurrentUser}
          getCurrentUserCallback = {this.getCurrentUser}
          updatePhotoObjCallback = {this.updatePhotoObj}
          lookupPhotoCallback = {this.lookupPhoto}
          getCommentsStrCallback = {this.getCommentsStr}
          getPhotosStrCallback = {this.getPhotosStr}
        />

      </div>
  )}
}

