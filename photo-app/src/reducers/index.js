
const initialState = {
  count: 0,


  vistorAuthenticated: false,

};



function authenticateUser(userCredentialStr, userListStr) {

  let users=JSON.parse(userListStr); //existing user db

//   let userCredential=JSON.parse(userCredentialStr);
//   let userObj={};
//   for (let i=0; i<users.length; i++) {
//     if (users[i].userId===userCredential.username) {
//       userObj=users[i] ;
//       break;
//     } 
//   };

//   if (userObj==={}) {
//     return false;
//   }

//   if (userObj.password===userCredential.password) {

//     //update current user
// // this.setState( {currentUser : userObj });
// // this.setState(  {currentUserId : userObj.userId});

//     return true;
//   } else {
//     return false;
//   }
}



function authReducer (state = initialState, action) {
  switch (action.type) {
    case 'AUTHENTICATE' :

      let authResult = authenticateUser( action.userCredentialStr, action.userListStr );
      let newState=Object.assign(state, { vistorAuthenticated: authResult });

      return newState;

    default: 
      return state;
  }
}

function reducer(state = initialState, action) {
  switch(action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      };
    case 'DECREMENT':
      return {
        count: state.count - 1
      };
    default:
      return state;
  }
}

export default reducer;
export {authReducer} ;