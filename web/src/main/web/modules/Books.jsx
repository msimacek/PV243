import React from 'react'
import * as B from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom'

import { apiGet, apiPost } from './Api'

class Input extends React.Component {
    handleChange( event ) {
        this.setState( { value: event.target.value } );
    }

    render() {
        let { label, ...rest } = this.props;
        return (
            <div className="form-group">
                {label && <label>{label}</label>}
                <input className="form-control" onChange={this.handleChange.bind( this )} {...rest} />
            </div>
        );
    }
}

class CreateBookRouted extends React.Component {
    handleSubmit( event ) {
        event.preventDefault();

        var data = {
            title: this.refs.title.state.value,
            isbn: this.refs.isbn.state.value,
            authors: [],
        };
        apiPost( "/rest/books", data )
            .then(() => this.props.history.push( "/" ) )
            .catch( function( res ) { console.log( res ) } );
    }

    render() {
        return (
            <div className="panel">
                <h2>Create book</h2>
                <form onSubmit={this.handleSubmit.bind( this )}>
                    <Input type="text" ref="title" label="Title" />
                    <Input type="text" ref="isbn" label="ISBN" />
                    <button type="submit" className="btn btn-primary">Create</button>
                </form>
            </div>
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