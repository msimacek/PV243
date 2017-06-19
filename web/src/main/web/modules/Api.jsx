export var credentials = {};

function setAuthHeader( headers ) {
    if ( credentials.password )
        headers.Authorization = 'Basic ' + btoa( credentials.email + ":" + credentials.password );
}

export function apiGet( endpoint ) {
    var headers = { 'Accept': 'application/json' };
    setAuthHeader( headers );
    return fetch( `/rest/${endpoint}`, { headers: headers } )
        .then( response => {
            if ( response.ok )
                return response.json();
            throw new Error( response.statusText );
        } );
}

export function logIn( email, password, onSuccess, onError ) {
    var headers = {
        Authorization: 'Basic ' + btoa( email + ":" + password ),
        Accept: 'application/json',
    }
    fetch( "/rest/profile", { headers: headers } )
        .then( response => {
            if ( response.ok ) {
                credentials.email = email;
                credentials.password = password;
                onSuccess( response );
            } else {
                onError( response );
            }
        } );
}

export function apiPost( endpoint, data ) {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    setAuthHeader( headers );
    return fetch( `/rest/${endpoint}`, { method: "POST", body: JSON.stringify( data ), headers: headers } );
}

export function apiPut( endpoint, data ) {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    setAuthHeader( headers );
    return fetch( `/rest/${endpoint}`, { method: "PUT", body: JSON.stringify( data ), headers: headers } );
}