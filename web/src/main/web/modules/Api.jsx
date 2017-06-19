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
    var role = Cookies.get( "role" );
    if ( email && password && role ) {
        credentials = {
            email: email,
            password: password,
            role: role,
        }
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
                return response.json().then( user => {
                    credentials.email = email;
                    credentials.password = password;
                    credentials.role = user.role;

                    Cookies.set( "email", email );
                    Cookies.set( "password", password );
                    Cookies.set( "role", user.role );
                } );
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