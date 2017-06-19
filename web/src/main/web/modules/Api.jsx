import * as Cookies from "js-cookie";

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

export function tryLoginFromCookie() {
    var email = Cookies.get( "email" );
    var password = Cookies.get( "password" );
    if ( email && password ) {
        credentials = { email: email, password: password };
    }
}

export function logIn( email, password ) {
    var headers = {
        Authorization: 'Basic ' + btoa( email + ":" + password ),
        Accept: 'application/json',
    }
    return fetch( "/rest/profile", { headers: headers } )
        .then( response => {
            if ( response.ok ) {
                credentials.email = email;
                credentials.password = password;

                Cookies.set( "email", email );
                Cookies.set( "password", password );

                return response.json();
            }
            throw new Error( response.statusText );
        } );
}

export function logOut() {
    credentials = {};
    Cookies.remove( "email" );
    Cookies.remove( "password" );
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