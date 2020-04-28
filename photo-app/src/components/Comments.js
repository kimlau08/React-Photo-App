import React, { Component } from 'react';

import cross from '../assets/Cross-in-circle.png'
import '../style/App.css'

//callbacks from props
let lookupUser; 
let addNewComment;
let deleteComment;
let getCurrentUser;
let updatePhotoObj;
let lookupPhoto;
let getCommentsStr;
let commentContainerId;

export default class Comments extends Component {
    constructor(props) {
        super(props);

        this.state = {

            //Use callbacks instead of passed-in object strings to avoid stale states, due to async activities from other components
            photoId: "",

            newComment: "",
            redirectToHome: false
        }

        this.displayLeftPhotoCard=this.displayLeftPhotoCard.bind(this);
        this.lookupComment=this.lookupComment.bind(this);
        this.displayComment=this.displayComment.bind(this);
        this.displayAddCommentBox=this.displayAddCommentBox.bind(this);
        this.handleAddComment=this.handleAddComment.bind(this);
        this.handleDone=this.handleDone.bind(this);
        this.handleCommentChange=this.handleCommentChange.bind(this);
        this.handleDeleteComment=this.handleDeleteComment.bind(this);
        this.displayRightCommentList=this.displayRightCommentList.bind(this);
        this.showModal=this.showModal.bind(this);
        this.hideModal=this.hideModal.bind(this);
    }

    displayLeftPhotoCard(photoId, imagePath) {

        let photoObj=JSON.parse(lookupPhoto(photoId));

        let user=lookupUser(photoObj.owner);   //lookup owner user of photo
        if (user === null ) {
            console.error( `cannot find user: id ${photoObj.owner}` );
        }
        return (
            
            // display photo image and likes, dislikes data
            <div className="leftPhotoCard">
                <img className="smallPhotoImg" src={imagePath} /> 

                <pre className="photoDetail">Likes: {photoObj.likes}     Dislikes: {photoObj.dislikes}</pre>
                <p className="photoDetail">by {user.name}</p>

            </div>
        )
    }

    lookupComment(id) {

        let commentList = JSON.parse(getCommentsStr());

        for (let i=0; i<commentList.length; i++) {
            if (id === commentList[i].id) {
                return commentList[i];
            }
        }
        return null;

    }

    displayComment(commentId) {

        let commentObj = this.lookupComment(commentId); 
        if (commentObj === null) {
            console.error(`Comment not found - comment id: ${commentId}`);
            return;
        }
        let comment=commentObj.comment;

        let userObj = lookupUser(commentObj.source); 
        let userId = userObj.userId;
        if (userObj === null) {
            console.error(`Comment source not found -  user id: ${commentObj.source}`);
            return;
        }

        return (
            <div className="commentLineBox">
                <div className="commentLine">
                    <p> {userObj.name} date time </p>
                    <p className="commentText"> {comment} </p>
                </div>
                <img className="crossImg" id={commentId} src={cross} onClick={this.handleDeleteComment} />
            </div>
        )
    }

    displayAddCommentBox() {

        return (
            <div className="addCommentBox">

                <p id="addCommentErrorMsg"></p>

                <textarea className="textAreaInput" name="description" rows="3" cols="40"  placeholder="add comment here" onChange={this.handleCommentChange} /><br />

                <button className="commentButton" onClick={this.handleAddComment}>Add Comment</button>
                <button className="commentButton" onClick={this.handleDone}>Done</button>

            </div>
        )
    }

    checkLoginStatus() {
        
        let currentUser=JSON.parse(getCurrentUser());

        if (Object.keys(currentUser).length === 0 &&
            currentUser.constructor === Object ) {    //empty object. no user logged in

            document.getElementById("addCommentErrorMsg").innerHTML="Please login before adding or deleting comment"
            
            return null;                     
        } else {
            document.getElementById("addCommentErrorMsg").innerHTML="";  //clear error msg
        }

        return currentUser;

    }

    handleCommentChange(event) {

        this.setState({newComment: event.target.value}); 
    }

    handleDeleteComment(event) {

        let currentUser = this.checkLoginStatus();
        if (currentUser === null ) {
            return;
        }

        let commentId = event.target.id;
        let user = event.target.name;        

        deleteComment(commentId, this.state.photoId);

    }

    handleAddComment(event) {

        let currentUser = this.checkLoginStatus();
        if (currentUser === null ) {
            return;
        }

        let newComment = this.state.newComment;
        let newPhotoObj = JSON.parse(lookupPhoto(this.state.photoId))
        let source = currentUser.id;

        if (newComment.length <= 0) {
            return;     //no comment entered
        }

        //add new comment to global state
        let newCommentObjStr = addNewComment( newComment, newPhotoObj.id, source  );
        let newCommentObj = JSON.parse(newCommentObjStr);

        //update photo comment list
        let comments=newPhotoObj.comments;
        comments.push(newCommentObj.id);
        Object.assign( newPhotoObj, {comments : comments});
        
        //update global photo state
        let newPhotoObjStr = JSON.stringify( newPhotoObj );
        updatePhotoObj( newPhotoObjStr );

    }
    handleDone(event) {
        this.hideModal(commentContainerId);
    }

    displayRightCommentList() {

        let photoObj=JSON.parse(lookupPhoto(this.state.photoId));;

        return (
            <div className="rightCommentList">

                <div className="commentListBox">
                    { photoObj.comments.map(this.displayComment) }  //display comments for the photo
                </div>
                {/* display input box and add comment button */}
                { this.displayAddCommentBox() }

            </div>
        )
    }

    showModal(containerId) {

        let containerElem = document.getElementById(containerId);
        if (containerElem !== null) {
            containerElem.style.zIndex = 100;
        }
    }
    hideModal(containerId) {

        let containerElem = document.getElementById(containerId);
        if (containerElem !== null) {
            containerElem.style.zIndex = -100;
        }
    }

    render() {

        if (this.props.location.photoId === undefined) {
            return <div></div>
        }

        let imagePath=this.props.location.imagePath;

        lookupUser = this.props.location.lookupUserCallback;
        addNewComment = this.props.location.addNewCommentCallback;
        deleteComment = this.props.location.deleteCommentCallback;
        getCurrentUser = this.props.location.getCurrentUserCallback;
        updatePhotoObj = this.props.location.updatePhotoObjCallback;
        lookupPhoto = this.props.location.lookupPhotoCallback;
        getCommentsStr = this.props.location.getCommentsStrCallback;

        this.state.photoId=this.props.location.photoId;

        commentContainerId="commentsContainer";
        this.showModal(commentContainerId);

        return (
            <div id={commentContainerId}>

                { this.displayLeftPhotoCard(this.state.photoId, imagePath) }

                { this.displayRightCommentList() }
            </div>
        )

    }
}

