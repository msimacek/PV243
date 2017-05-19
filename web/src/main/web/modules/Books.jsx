import React from 'react'
import * as B from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom'

import { apiGet, apiPost } from './Api'

class CreateBookRouted extends React.Component {
    handleSubmit( event ) {
        event.preventDefault();

        var data = {
            title: this.refs.title.value,
            isbn: this.refs.isbn.value,
            authors: [],
        };
        apiPost( "/rest/books", data )
            .then(() => this.props.history.push( "/" ) )
            .catch( function( res ) { console.log( res ) } );
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind( this )}>
                <input type="text" ref="title" />
                <input type="text" ref="isbn" />
                <button type="submit">Create</button>
            </form>
        );
    }
}

export const CreateBook = withRouter( CreateBookRouted );

export class ListBooks extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { books: [] };
    }

    componentDidMount() {
        apiGet( "/rest/books" )
            .then( json => {
                this.setState( { books: json } );
            } );
    }

    render() {
        return (
            <B.ListGroup>
                {
                    this.state.books.map( book => {
                        return <B.ListGroupItem>{book.title}</B.ListGroupItem>
                    } )
                }
            </B.ListGroup>
        );
    }
}