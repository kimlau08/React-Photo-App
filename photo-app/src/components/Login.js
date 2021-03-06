import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../style/App.css'

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state={
            userId: "",
            password: "",

            redirectToHome: false        }

        this.handleUserIdChange=this.handleUserIdChange.bind(this);
        this.handlePasswordChange=this.handlePasswordChange.bind(this);
        this.handleSubmitForm=this.handleSubmitForm.bind(this);
    }

    handleUserIdChange(event) {
        if (event.target !== undefined) {

            this.setState({userId: event.target.value}); //update the state when the field is changed
        }
    }
    handlePasswordChange(event) {
        if (event.target !== undefined) {

            this.setState({password: event.target.value}); 
        }
    }
    handleSubmitForm(event) {

        if (event.target.elements === undefined) {
            return;
        }

        //gather form field and values and put in user info object
        let userObj={};
        for (let i=0; i<event.target.elements.length; i++) {
            let elem=event.target.elements[i];
            if (elem.type !== "text") {
                continue;
            }

            let keyValue={ [elem.name]: elem.value  }
            //merge key:value pair to userObj
            Object.assign(userObj, keyValue);

        }

        event.preventDefault();

        //authenticate user
        let userStr=JSON.stringify(userObj)
        let authResult=this.props.location.authenticateUserCallBack(userStr);

        if (authResult) {   //user authenticated successfully
            //Redirect back to root (App component)
            this.setState( { redirectToHome: true } ); 

            //swap back to the Home component display before redirect
            this.props.location.swapDisplayCallback("homeContainer", this.props);
        } 

        //login error
        document.getElementById('authErrorMsg').innerHTML="Incorrect username or password."
        
    }

    componentDidMount() {
        
        this.setState(this.state); //re-render to clear the Home component display
    }

    render() {

        if (this.props.location.authenticateUserCallBack === undefined ) {
            return <div></div>
        }
        if (this.props.location.swapDisplayCallback === undefined) {
            return <div></div>
        }

        let toContainerId="loginContainer";
        if (! this.state.redirectToHome) {  //do not overwrite display setup by submit form if redirecting away from login
            
            this.props.location.swapDisplayCallback(toContainerId, this.props);
        }

        return (
            <div id={toContainerId}>
                
                {this.state.redirectToHome &&
                        <Redirect to='/Home' />    //route back to root (App component) depending on state
                }
                <form className="LoginFormContainer" onSubmit={this.handleSubmitForm}>
                    <p  className="loginTitle">Login</p>

                    <label className="userIdInput">
                        username
                        <input className="textInput" type="text" name="username" value={this.state.userId} placeholder="user id" onChange={this.handleUserIdChange} />
                    </label>

                    <label className="passwordInput">
                        password
                        <input className="textInput" type="text" name="password" value={this.state.password} placeholder="password" onChange={this.handlePasswordChange} />
                    </label>

                    <p  id="authErrorMsg"></p>

                    <button type="submit" className="loginButton">Login</button>

                </form>
            </div>
        )
    }
}

