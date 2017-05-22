import React from 'react'
import * as B from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom'

import { apiGet, apiPost } from './Api'

function Input( { label, ...rest } ) {
    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <input className="form-control" {...rest} />
        </div>
    );
}

export class CreateAuthor extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { name: "", surname: "" };
        this.handleInputChange = this.handleInputChange.bind( this );
        this.handleSubmit = this.handleSubmit.bind( this );
    }

    handleSubmit( event ) {
        event.preventDefault();

        var data = {
            name: this.state.name,
            surname: this.state.surname,
        };
        apiPost( "authors", data )
            .then(() => this.props.history.push( "/authors" ) )
            .catch( function( res ) { console.log( res ) } );
    }

    handleInputChange( event ) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState( {
            [name]: value
        } );
    }

    render() {
        return (
            <div className="panel">
                <h2>Create author</h2>
                <form onSubmit={this.handleSubmit}>
                    <Input type="text" onChange={this.handleInputChange} name="name" label="Name" />
                    <Input type="text" onChange={this.handleInputChange} name="surname" label="Surname" />
                    <button type="submit" onChange={this.handleInputChange} className="btn btn-primary">Create</button>
                </form>
            </div>
        );
    }
}

export class CreateBook extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { title: "", isbn: "" };
        this.handleInputChange = this.handleInputChange.bind( this );
        this.handleSubmit = this.handleSubmit.bind( this );
    }

    handleSubmit( event ) {
        event.preventDefault();

        var data = {
            title: this.state.title,
            isbn: this.state.isbn,
            authors: [],
        };
        apiPost( "books", data )
            .then(() => this.props.history.push( "/books" ) )
            .catch( function( res ) { console.log( res ) } );
    }

    handleInputChange( event ) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState( {
            [name]: value
        } );
    }

    render() {
        return (
            <div className="panel">
                <h2>Create book</h2>
                <form onSubmit={this.handleSubmit}>
                    <Input type="text" onChange={this.handleInputChange} name="title" label="Title" />
                    <Input type="text" onChange={this.handleInputChange} name="isbn" label="ISBN" />
                    <button type="submit" onChange={this.handleInputChange} className="btn btn-primary">Create</button>
                </form>
            </div>
        );
    }
}

class ListView extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            loaded: false,
            error: null,
            objects: [],
        };
    }

    componentDidMount() {
        apiGet( this.endpoint )
            .then( json => {
                this.setState( { loaded: true, objects: json } );
            } )
            .catch( reason => {
                this.setState( { loaded: true, error: reason } );
            } );
    }

    render() {
        if ( !this.state.loaded )
            return <div>Loading</div>;
        if ( this.state.error )
            return <div>Loading error: {this.state.error.message}</div>
        if ( !this.state.objects.length )
            return <div>No entities in the database</div>;
        return (
            <B.ListGroup>
                {this.state.objects.map( object => this.renderObject( object ) )}
            </B.ListGroup>
        );
    }
}

export class ListBooks extends ListView {
    constructor( props ) {
        super( props );
        this.endpoint = 'books';
    }

    renderObject( book ) {
        return <B.ListGroupItem key={book.id}>{book.title}</B.ListGroupItem>;
    }
}

export class ListAuthors extends ListView {
    constructor( props ) {
        super( props );
        this.endpoint = 'authors';
    }

    renderObject( author ) {
        return <B.ListGroupItem key={author.id}>{author.name} {author.surname}</B.ListGroupItem>;
    }
}