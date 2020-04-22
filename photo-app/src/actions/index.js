
const authenticateVisitor = (userCredentialStr, userListStr) => {
    return {                //return an object
        type: "AUTHENTICATE",

        userCredentialStr: userCredentialStr,
        userListStr: userListStr
    }
}

const inc = () => {
    return {                //return an object
        type: "INCREMENT"
    }
}

const dec = () => {
    return {                //return an object
        type: "DECREMENT"
    }
}

export default inc;
export {dec} ;

export {authenticateVisitor} ;