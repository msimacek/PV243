import React from 'react'
import * as B from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import ReactSelect from 'react-select';

import { apiGet, apiPost } from './Api'

function formControl( Component, { label, ...rest } ) {
    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <Component className="form-control" {...rest} />
        </div>
    );
}

const Input = props => formControl( 'input', props );

function Select( { label, ...rest } ) {
    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <ReactSelect.Async {...rest} />
        </div>
    );
}

function authorString( author ) {
    return `${author.name} ${author.surname}`;
}

function authorsString( authors ) {
    if ( !authors.length )
        return "unknown author";
    return authors.map( authorString ).join( ', ' );
}

export class CreateAuthor extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { name: "", surname: "" };
    }

    handleSubmit = ( event ) => {
        event.preventDefault();

        var data = {
            name: this.state.name,
            surname: this.state.surname,
        };
        apiPost( "authors", data )
            .then(() => this.props.history.push( "/authors" ) )
            .catch( function( res ) { console.log( res ) } );
    }

    handleInputChange = ( event ) => {
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
        this.state = { title: "", isbn: "", authors: [] };
    }

    handleSubmit = ( event ) => {
        event.preventDefault();

        var data = {
            title: this.state.title,
            isbn: this.state.isbn,
            authors: this.state.authors.map( author => ( { id: author.value } ) ),
        };
        apiPost( "books", data )
            .then(() => this.props.history.push( "/books" ) )
            .catch( function( res ) { console.log( res ) } );
    }

    handleInputChange = ( event ) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState( {
            [name]: value
        } );
    }

    handleAuthorsChange = ( values ) => {
        console.log( values[0] );
        this.setState( { authors: values } );
    }

    getAuthors() {
        return apiGet( 'authors' )
            .then( authors => {
                return {
                    options: authors.map( author =>
                        ( { value: author.id, label: authorString( author ) } )
                    )
                };
            } );
    }

    render() {
        return (
            <div className="panel">
                <h2>Create book</h2>
                <form onSubmit={this.handleSubmit}>
                    <Input type="text" onChange={this.handleInputChange} name="title" label="Title" />
                    <Input type="text" onChange={this.handleInputChange} name="isbn" label="ISBN" />
                    <Select multi onChange={this.handleAuthorsChange}
                        loadOptions={this.getAuthors} value={this.state.authors}
                        name="authors" label="Authors" />
                    <button type="submit" className="btn btn-primary">Create</button>
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
        apiGet( this.props.endpoint )
            .then( json => {
                this.setState( { loaded: true, objects: json } );
            } )
            .catch( reason => {
                this.setState( { loaded: true, error: reason } );
            } );
    }

    render() {
        let content;
        if ( this.state.error )
            content = <div>Loading error: {this.state.error.message}</div>;
        else if ( !this.state.loaded )
            content = <div>Loading</div>;
        else if ( !this.state.objects.length )
            content = <div>No entities in the database</div>;
        else
            content = (
                <B.ListGroup>
                    {this.state.objects.map( object => <B.ListGroupItem key={object.id}>{this.props.renderObject( object )}</B.ListGroupItem> )}
                </B.ListGroup>
            );
        return (
            <div>
                <h2>{this.props.title}</h2>
                {content}
            </div>
        );
    }
}

export function ListBooks() {
    return <ListView endpoint="books" title="All books" renderObject={book => `${book.title} (${authorsString(book.authors)})`} />;
}

export function ListAuthors() {
    return <ListView endpoint="authors" title="All authors" renderObject={authorString} />;
}