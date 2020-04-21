import React, { Component } from 'react';

import avatarImg from './ImageDB';

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state={
            profilePhotos : avatarImg
        }
        
    }

    render() {
        return (
            <div className="profileContainer">

                <div className="userInfoRow">

                </div>
            </div>
        )
    }
}
