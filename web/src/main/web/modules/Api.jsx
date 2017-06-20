import * as Cookies from "js-cookie";

export var credentials = {};
export const websocket = connectWebsocket();

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
    var user = Cookies.get( "user" );
    if ( email && password && user ) {
        credentials = {
            email: email,
            password: password,
            user: JSON.parse( user ),
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
                    credentials.user = user;

                    Cookies.set( "email", email );
                    Cookies.set( "password", password );
                    Cookies.set( "user", JSON.stringify( user ) );
                } );
            }
            throw new Error( response.statusText );
        } );
}

export function logOut() {
    credentials = {};
    Cookies.remove( "email" );
    Cookies.remove( "password" );
    Cookies.remove( "user" );
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

export function apiDelete( endpoint ) {
    var headers = {
        'Accept': 'application/json',
    };
    setAuthHeader( headers );
    return fetch( `/rest/${endpoint}`, { method: "DELETE", headers: headers } );
}

function connectWebsocket () {
    const websocket = new WebSocket('ws://localhost:8080/websocket');
    websocket.open();

    window.addEventListener('unload', () => websocket.close());

    return websocket
}
