
const initialState = {
  count: 0,

  loggedInUserId:  "",
  loggedInUserObjStr: ""

};


function authenticateUser(userCredentialStr, userListStr, setCurrentUerCallback) {

  let users=JSON.parse(userListStr); //existing user db

  let userCredential=JSON.parse(userCredentialStr);
  let userObj={};
  for (let i=0; i<users.length; i++) {
    if (users[i].userId===userCredential.username) {
      userObj=users[i] ;
      break;
    } 
  };

  if (userObj==={}) {
    return null;
  }

  if (userObj.password===userCredential.password) {

    //update current user
    let userObjStr = JSON.stringify(userObj);
    setCurrentUerCallback(userObjStr) ;

    return userObj;
  } else {
    return null;
  }
}



function authReducer (state = initialState, action) {
  switch (action.type) {
    case 'AUTHENTICATE' :

      let authResult = authenticateUser( action.userCredentialStr, action.userListStr, action.setCurrentUer );
      if ( authResult === null ) {   // auth failed
        return state;  
      }

      //auth succeed
      let loggedInUserId = authResult.userId;
      let authResultStr = JSON.stringify(authResult);
      
      let newState=Object.assign(state, 
          { 
              loggedInUserId: loggedInUserId,
              loggedInUserObjStr: authResultStr
          });

      return newState;

    default: 
      return state;
  }
}

export default authReducer;
