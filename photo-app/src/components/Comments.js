import React, { Component } from 'react';


//callbacks from props
let lookupUser; 
let addNewComment;
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
        this.displayRightCommentList=this.displayRightCommentList.bind(this);
        this.showModal=this.showModal.bind(this);
        this.hideModal=this.hideModal.bind(this);
    }

    displayLeftPhotoCard(photoId, imagePath) {

        let photoObj=JSON.parse(lookupPhoto(photoId));;

        let user=lookupUser(photoObj.owner);
        return (
            
            <div className="leftPhotoCard">
                <img className="photoImg" src={imagePath} /> 

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
        if (userObj === null) {
            console.error(`Comment source not found -  user id: ${commentObj.source}`);
            return;
        }

        return (
            <div className="commentLine">
                <p> {userObj.name} date time </p>
                <p className="commentText"> {comment} </p>
            </div>
        )
    }

    displayAddCommentBox() {

        return (
            <div className="addCommentBox">

                <p id="addCommentErrorMsg"></p>

                <textarea className="textAreaInput" name="description" rows="3" cols="40"  placeholder="add comment here" onChange={this.handleCommentChange} />

                <button className="commentButton" onClick={this.handleAddComment}>Add Comment</button>
                <button className="commentButton" onClick={this.handleDone}>Done</button>

            </div>
        )
    }

    handleCommentChange(event) {

        this.setState({newComment: event.target.value}); 
    }

    handleAddComment(event) {

        let currentUser=JSON.parse(getCurrentUser());

        if (Object.keys(currentUser).length === 0 &&
            currentUser.constructor === Object ) {    //empty object. no user logged in

            document.getElementById("addCommentErrorMsg").innerHTML="Please login before commenting"
            
            return;                     
        } else {
            document.getElementById("addCommentErrorMsg").innerHTML="";  //clear error msg
        }

        let newComment = this.state.newComment;
        let photo = JSON.parse(lookupPhoto(this.state.photoId)).id;
        let source = currentUser.id;

        if (newComment.length <= 0) {
            return;     //no comment entered
        }

        //add new comment to global state
        let newCommentObjStr = addNewComment( newComment, photo, source  );
        let newCommentObj = JSON.parse(newCommentObjStr);

        //add new comment to local state 
        let newCommentList=JSON.parse(getCommentsStr());
        newCommentList.push( newCommentObj );
        this.setState( { commentList : newCommentList } );

        //update local photo comment list
        let newPhotoObj = JSON.parse(lookupPhoto(this.state.photoId));;
        let comments=newPhotoObj.comments;
        comments.push(newCommentObj.id);
        Object.assign( newPhotoObj, {comments : comments});

        this.setState( {photoObj : newPhotoObj} )
        
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
                    { photoObj.comments.map(this.displayComment) }
                </div>

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

