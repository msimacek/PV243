import 'react-hot-loader/patch';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './modules/App';

render( <AppContainer><App /></AppContainer>, document.getElementById( 'react-root' ) );

if ( module.hot ) {
    module.hot.accept( './modules/App', () => {
        const NextApp = require( './modules/App' ).default;
        render( <NextApp/>, document.getElementById( 'react-root' ) );
    });
}