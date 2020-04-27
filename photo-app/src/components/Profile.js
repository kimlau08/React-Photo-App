import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../style/App.css'

import {avatarImg} from './ImageDB';
import PhotoGrid from './PhotoGrid';

let swapDisplay;
let lookupUser;
let getCurrentUser;
let getUserPhotos;
let lookupPhoto;
let currentUser={};
let currentUserStr="";


export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profileImages : avatarImg,

            redirectToHome: false        
        }

        this.displayUserInfo=this.displayUserInfo.bind(this);
        this.handleDeleteProfile=this.handleDeleteProfile.bind(this);
    }

    displayUserInfo(userObj) {
        return (
            <React.Fragment>
                <img className="userImg" src={this.state.profileImages[userObj.profileImgIdx]} /> 
                <div>
                    <h1 style={{color:'grey'}}><br />name: {userObj.name}</h1>
                    <button className="deleteProfBtn" onClick={this.handleDeleteProfile}>Delete Profile</button>
                </div>
            </React.Fragment>
        )
    }

    handleDeleteProfile(event) {
        
        if (event.target === undefined) {
            return;
        }

        if (window.confirm("Deleting user profile. Please confirm.")) {

            this.props.location.deleteUserCallback();

        }
    }

    render () {
        let fromContainer="";
        
        if (this.props.location.lookupPhotoCallback != undefined &&   //invoked as React route
            this.props.location.getCurrentUserCallback !== undefined) {

            swapDisplay = this.props.location.swapDisplayCallback;
            lookupUser = this.props.location.lookupUserCallback;
            getCurrentUser = this.props.location.getCurrentUserCallback;
            lookupPhoto = this.props.location.lookupPhotoCallback;
            getUserPhotos = this.props.location.getUserPhotosCallback;

        } else {
            return <div></div>
        }

        currentUserStr = getCurrentUser();          //to be passed along to Comments component
        currentUser = JSON.parse(currentUserStr);

        if (Object.keys(currentUser).length === 0 &&
        currentUser.constructor === Object ) {    //empty object. no user logged in

            alert("Please login")
            
            return <div></div>;                     
        } 

        fromContainer = this.props.fromContainer;

        let toContainerId="profileContainer";
        swapDisplay(toContainerId, this.props);

        if (fromContainer === toContainerId &&   //do not render if coming as a React route 
            this.props.location !== undefined ) {
            return <div></div>
        }

        let userPhotoList=JSON.parse(getUserPhotos(currentUser.id));
        userPhotoList.sort( (x , y ) => y.likes - x.likes ) ;  //sort in descending order of likes

        let userPhotoListStr=JSON.stringify(userPhotoList);

        return (
            <div id={toContainerId}>
                <div className="userInfoBox">
                    {this.displayUserInfo(currentUser)};
                </div>

                <ul className="userPhotoBox">
                    <li>

                        <PhotoGrid photoListStr={userPhotoListStr} 
                                   lookupUserCallback={lookupUser}
                                   lookupPhotoCallback={lookupPhoto}
                                   getCurrentUserCallback={getCurrentUser}
                        />
                    </li>
                </ul>
            </div>
        )
    }
}

