export function apiGet( endpoint ) {
    return fetch( `/rest/${endpoint}`, { headers: { 'Accept': 'application/json' } } )
        .then( response => {
            if ( response.ok )
                return response.json();
            throw new Error( response.statusText );
        } );
}

export function apiPost( endpoint, data ) {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    return fetch( `/rest/${endpoint}`, { method: "POST", body: JSON.stringify( data ), headers: headers } );
}

export function apiPut( endpoint, data ) {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    return fetch( `/rest/${endpoint}`, { method: "PUT", body: JSON.stringify( data ), headers: headers } );
}