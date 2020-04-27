import React, { Component } from 'react';
import '../style/App.css'

import photoImages from './ImageDB';

//  let swapDisplay;
let lookupUser;
let lookupPhoto;
let getCurrentUser;
let currentUser={};


export default class PhotoGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images : photoImages
        }

        this.getLikeDislikeStyle=this.getLikeDislikeStyle.bind(this);
        this.displayPhotoAndInfo=this.displayPhotoAndInfo.bind(this);
    }

    getLikeDislikeStyle(photoObj) {

        //neutral default style - not like or dislike
        let borderStyle={
            border: 'solid 1px lightslategrey'
        };
    
    
        if (Object.keys(currentUser).length === 0 &&
            currentUser.constructor === Object ) {    //empty object. no user logged in
            return borderStyle;                     
        }
    
        const likeStyle = {
            border: 'solid 5px lightcoral'
        }
        const dislikeStyle = {
            border: 'solid 5px lightslategrey'
        }
        for (let i=0; i<currentUser.likePhoto.length; i++) {
            if (photoObj.id === currentUser.likePhoto[i]) {
                //current user liked this photo. apply like styling
                borderStyle=likeStyle;
            } 
        }
        for (let i=0; i<currentUser.dislikePhoto.length; i++) {
            if(photoObj.id === currentUser.dislikePhoto[i]) {
                //disliked this photo. apply dislike styling
                borderStyle=dislikeStyle;
            }
        }
    
        return borderStyle;
    }
    
    displayPhotoAndInfo(photoId) {  
    
        let photoObj=JSON.parse(lookupPhoto(photoId));
    
        if (photoObj === undefined) {
           return <div></div>;
        }
    
        let user=lookupUser(photoObj.owner);     //lookupUser is passed in object parm
        if (user === null) {
            console.error(`Photo ${photoObj.id} has unknown user with id ${photoObj.owner}`);
            return <div></div>;
        }
    
        //apply different border styling based on current user like/dislike
        let borderStyle=this.getLikeDislikeStyle(photoObj);
    
        return (
            <div className="photoCard">
        
                <img className="photoImg" style={borderStyle} src={this.state.images[photoObj.imageIdx]} /> 
                
                <pre className="photoDetail">Likes: {photoObj.likes}     Dislikes: {photoObj.dislikes}</pre>
                <p className="photoDetail">by {user.name}</p>
            </div>
        )
    }

    render () {
        
        if (this.props.photoListStr != undefined ) {

            lookupUser = this.props.lookupUserCallback;
            lookupPhoto = this.props.lookupPhotoCallback;
            getCurrentUser = this.props.getCurrentUserCallback;

        } else {
            return <div></div>
        }

        let currentUserStr = getCurrentUser();
        currentUser=JSON.parse(currentUserStr);
        let photoArray = JSON.parse(this.props.photoListStr);

        photoArray.sort( (x , y ) => y.likes - x.likes ) ;  //sort in descending order of likes

        return (
            <div id="photoGrid">
                <ul>
                    <li>
                        { photoArray.map( this.displayPhotoAndInfo) }
                    </li>
                </ul>
            </div>
        )
    }
}

