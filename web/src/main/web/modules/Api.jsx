export function apiGet( endpoint ) {
    return fetch( endpoint, { headers: { 'Accept': 'application/json' } } )
        .then( response => response.json() );
}

export function apiPost( endpoint, data ) {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    return fetch( "/rest/books", { method: "POST", body: JSON.stringify( data ), headers: headers } );
}