import React, { Component } from 'react';
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";

import photoImages from './ImageDB'; 

import Comments from './Comments';

//callbacks from props
let swapDisplay;
let lookupUser; 
let addNewComment;
let getCurrentUser;
let updatePhotoObj;
let lookupPhoto;
let getCommentsStr;
let getPhotosStr;
let currentUser={};
let currentUserStr="";
let commentListStr="";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state={

            images: photoImages
        }

        this.getLikeDislikeStyle=this.getLikeDislikeStyle.bind(this);
        this.displayPhotoAndInfo=this.displayPhotoAndInfo.bind(this);
        this.handleUpdate=this.handleUpdate.bind(this);

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

    displayPhotoAndInfo(photoObj) {  

        if (photoObj === undefined) {
           return <div></div>;
        }
    
        let imagePath=this.state.images[photoObj.imageIdx];
    
        let user=lookupUser(photoObj.owner);     //lookupUser is passed in object parm
        if (user === null) {
            console.error(`Photo ${photoObj.id} has unknown user with id ${photoObj.owner}`);
            return <div></div>;
        }

        //apply different border styling based on current user like/dislike
        let borderStyle=this.getLikeDislikeStyle(photoObj);
    
        return (
            <div className="photoCard">
        
                <Link to={{
                        pathname:         "/Comments",
                            photoId:          photoObj.id,
                            imagePath:        imagePath,
                            currentUserStr:   currentUserStr,
                            commentListStr:   commentListStr,

                            lookupUserCallback: lookupUser,
                            swapDisplayCallback: swapDisplay,
                            addNewCommentCallback: addNewComment,
                            getCurrentUserCallback: getCurrentUser,
                            updatePhotoObjCallback: updatePhotoObj,
                            
                            lookupPhotoCallback: lookupPhoto,
                            getCommentsStrCallback: getCommentsStr,
                            handleUpdateCallback: this.handleUpdate
                        }}>
                    <img className="photoImg" style={borderStyle} src={this.state.images[photoObj.imageIdx]} /> 
                </Link>
                
                <pre className="photoDetail">Likes: {photoObj.likes}     Dislikes: {photoObj.dislikes}</pre>
                <p className="photoDetail">by {user.name}</p>
            </div>
        )
    }

    // componentDidMount() {
        
    //     this.setState(this.state); //re-render to clear the Home component display
    // }

    handleUpdate() {
        this.forceUpdate();
    }

    render() {

        let photos=[];
        let fromContainer="";
        let hasData=false;


        //check this.props and then this.props.location for info
        
        if (this.props.getPhotosStrCallback !== undefined  &&       //invoked as React component
            this.props.getCurrentUserCallback !== undefined) {

            swapDisplay = this.props.swapDisplayCallback;
            lookupUser = this.props.lookupUserCallback;
            addNewComment = this.props.addNewCommentCallback;
            getCurrentUser = this.props.getCurrentUserCallback;
            updatePhotoObj = this.props.updatePhotoObjCallback;
            lookupPhoto = this.props.lookupPhotoCallback;
            getCommentsStr = this.props.getCommentsStrCallback;
            getPhotosStr = this.props.getPhotosStrCallback;

            hasData = true;

        } else if (this.props.location.getPhotosStrCallback != undefined &&   //invoked as React route
                    this.props.location.getCurrentUserCallback !== undefined) {

            swapDisplay = this.props.location.swapDisplayCallback;
            lookupUser = this.props.location.lookupUserCallback;
            addNewComment = this.props.location.addNewCommentCallback;
            getCurrentUser = this.props.location.getCurrentUserCallback;
            updatePhotoObj = this.props.location.updatePhotoObjCallback;
            lookupPhoto = this.props.location.lookupPhotoCallback;
            getCommentsStr = this.props.location.getCommentsStrCallback;
            getPhotosStr = this.props.location.getPhotosStrCallback;

            hasData = true;
        }

        if (!hasData) {
            return <div></div>
        }

        photos = JSON.parse(getPhotosStr());
        currentUserStr = getCurrentUser();          //to be passed along to Comments component
        currentUser = JSON.parse(currentUserStr);
        commentListStr = getCommentsStr();
        fromContainer = this.props.fromContainer;

        let toContainerId="homeContainer";
        swapDisplay(toContainerId, this.props);

        if (fromContainer === toContainerId &&   //do not render if coming as a React route 
            this.props.location !== undefined ) {
            return <div></div>
        }

        photos.sort( (x , y ) => y.likes - x.likes ) ;  //sort in descending order of likes

        return (
            <div id={toContainerId}>
                <Router>
        
                {/* Render photo list */}
                <nav>
                    <ul>
                    <li>
                        { photos.map( this.displayPhotoAndInfo) }
                    </li>
                    </ul>
                </nav>
        
                {/* Route to Comment */}
                <Switch>
                    <Route path="/Comments" component={Comments} />
                </Switch>
        
                </Router>    

            </div>
        )
    }
}

