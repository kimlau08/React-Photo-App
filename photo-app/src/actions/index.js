
const authenticateVisitor = (userCredentialStr, userListStr, setCurrentUserCallback) => {
    return {                //return an object
        type: "AUTHENTICATE",

        userCredentialStr: userCredentialStr,
        userListStr: userListStr,
        setCurrentUer: setCurrentUserCallback
    }
}


export default authenticateVisitor;
