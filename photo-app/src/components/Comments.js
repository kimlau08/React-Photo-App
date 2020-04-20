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
    }

    handleDeletePhoto(event) {

    }

    componentDidMount() {
        
        this.setState(this.state); //re-render to show Comments component
    }

    displayLeftPhotoCard(photoObj, imagePath) {

        
        let user=lookupUser(photoObj.owner);
        return (
            
            <div className="photoCard">
                <img className="photoImg" src={imagePath} /> 

                <pre className="photoDetail">Likes: {photoObj.likes}     Dislikes: {photoObj.dislikes}</pre>
                <p className="photoDetail">by {user.name}</p><br /><br /><br />
                <button className="deletePhotoButton" onClick={this.handleDeletePhoto}>Delete</button>

            </div>
        )
    }

    render() {

        if (this.props.location.photoObjStr === undefined) {
            return <div></div>
        }
        
        let toContainerId="CommentsContainer";
        if (! this.state.redirectToHome) {  //do not overwrite display setup by submit form if redirecting away from login
            
            this.props.location.swapDisplayCallback(toContainerId, this.props);
        }


        let photoObj=JSON.parse(this.props.location.photoObjStr);
        let imagePath=this.props.location.imagePath;
        let currentUser=JSON.parse(this.props.location.currentUserStr);
        let commentList=JSON.parse(this.props.location.commentListStr);

        lookupUser = this.props.location.lookupUserCallback;


        return (
            <div id="CommentsContainer">
                <h1 style={{color:'blue'}}>Welcome to the Comments page</h1>

                { this.displayLeftPhotoCard(photoObj, imagePath) }
            </div>
        )

    }
}

