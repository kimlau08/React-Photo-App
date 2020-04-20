import React, { Component } from 'react';
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";

import photoImages from './ImageDB'; 

import Comments from './Comments';


//callbacks from props
let swapDisplay;
let lookupUser; 
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
    
        let photoStr=JSON.stringify(photoObj);
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
                            photoObjStr:      photoStr,
                            imagePath:        imagePath,
                            currentUserStr:   currentUserStr,
                            commentListStr:   commentListStr,

                            lookupUserCallback: lookupUser,
                            swapDisplayCallback: swapDisplay,
                        }}>
                    <img className="photoImg" style={borderStyle} src={this.state.images[photoObj.imageIdx]} /> 
                </Link>
                
                <pre className="photoDetail">Likes: {photoObj.likes}     Dislikes: {photoObj.dislikes}</pre>
                <p className="photoDetail">by {user.name}</p>
            </div>
        )
    }

    componentDidMount() {
        
        this.setState(this.state); //re-render to clear the Home component display
    }

    render() {

        let photos=[];
        let fromContainer="";
        let hasData=false;


        //check this.props and then this.props.location for info
        
        if (this.props.photoListStr !== undefined  &&       //invoked as React component
            this.props.currentUserStr !== undefined) {

            photos = JSON.parse(this.props.photoListStr);
            currentUser = JSON.parse(this.props.currentUserStr);
            currentUserStr = this.props.currentUserStr;         //to be passed along to Comments component
            commentListStr = this.props.commentListStr;
            fromContainer = this.props.fromContainer;
            hasData = true;

            swapDisplay = this.props.swapDisplayCallback;
            lookupUser = this.props.lookupUserCallback;

        } else if (this.props.location.photoListStr != undefined &&   //invoked as React route
                    this.props.location.currentUserStr !== undefined) {

            photos = JSON.parse(this.props.location.photoListStr);
            currentUser = JSON.parse(this.props.location.currentUserStr);
            currentUserStr = this.props.location.currentUserStr;      //to be passed along to Comments component
            commentListStr = this.props.location.commentListStr; 
            fromContainer = this.props.location.fromContainer;
            hasData = true;

            swapDisplay = this.props.location.swapDisplayCallback;
            lookupUser = this.props.location.lookupUserCallback;

        }

        if (!hasData) {
            return <div></div>
        }

        let toContainerId="homeContainer";
        swapDisplay(toContainerId, this.props);

        if (fromContainer === toContainerId &&   //do not render if coming as a React route 
            this.props.location !== undefined ) {
            return <div></div>
        }


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

