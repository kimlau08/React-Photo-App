import React from 'react';

function Logout (props) {


    if (props.location.logoutUserCallback === undefined ) {
        return <div></div>
    }
    if (props.location.swapDisplayCallback === undefined) {
        return <div></div>
    }

    props.location.logoutUserCallback();

    return (
        <div></div>
    )
}

export default Logout;