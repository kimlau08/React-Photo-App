import React, { Component } from 'react';
import '../style/App.css'

import photoImages from './ImageDB';
import PhotoGrid from './PhotoGrid';

let swapDisplay;
let lookupUser;
let getCurrentUser;
let lookupPhoto;
let currentUser={};
let currentUserStr="";


export default class Bookmarks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images : photoImages
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

        let toContainerId="bookmarksContainer";
        swapDisplay(toContainerId, this.props);

        if (fromContainer === toContainerId &&   //do not render if coming as a React route 
            this.props.location !== undefined ) {
            return <div></div>
        }

        let bookmarkPhotos = currentUser.bookmarkedPhoto;
        bookmarkPhotos.sort( (x , y ) => y.likes - x.likes ) ;  //sort in descending order of likes

        let bookmarkedPhotoStr = JSON.stringify(bookmarkPhotos);

        return (
            <div id={toContainerId}>
                <ul>
                    <li>

                        <PhotoGrid photoListStr={bookmarkedPhotoStr} 
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

