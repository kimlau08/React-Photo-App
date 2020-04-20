import React, { Component } from 'react';


//callbacks from props
let lookupUser; 

export default class Comments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newComment: "",

            redirectToHome: false
        }

        this.displayLeftPhotoCard=this.displayLeftPhotoCard.bind(this);
        this.handleDeletePhoto=this.handleDeletePhoto.bind(this);
        this.lookupComment=this.lookupComment.bind(this);
        this.displayComment=this.displayComment.bind(this);
        this.displayRightCommentList=this.displayRightCommentList.bind(this);
    }

    handleDeletePhoto(event) {

    }

    displayLeftPhotoCard(photoObj, imagePath) {

        let user=lookupUser(photoObj.owner);
        return (
            
            <div className="leftPhotoCard">
                <img className="photoImg" src={imagePath} /> 

                <pre className="photoDetail">Likes: {photoObj.likes}     Dislikes: {photoObj.dislikes}</pre>
                <p className="photoDetail">by {user.name}</p><br /><br />
                <button className="deletePhotoButton" onClick={this.handleDeletePhoto}>Delete</button>

            </div>
        )
    }

    lookupComment(id) {

    }

    displayComment(commentObj) {

        let comment = this.lookupComment(commentObj.id); 
        return (
            <div>

            </div>
        )
    }

    displayRightCommentList(photoObj) {
        return (
            <div className="rightCommentList">
                { photoObj.comments.map(this.displayComment) }
            </div>
        )
    }

    render() {

        if (this.props.location.photoObjStr === undefined) {
            return <div></div>
        }

        let photoObj=JSON.parse(this.props.location.photoObjStr);
        let imagePath=this.props.location.imagePath;
        let currentUser=JSON.parse(this.props.location.currentUserStr);
        let commentList=JSON.parse(this.props.location.commentListStr);

        lookupUser = this.props.location.lookupUserCallback;


        return (
            <div id="commentsContainer">

                { this.displayLeftPhotoCard(photoObj, imagePath) }
            </div>
        )

    }
}

