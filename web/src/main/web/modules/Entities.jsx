import React from 'react'
import * as B from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import ReactSelect from 'react-select';

import { apiGet, apiPost, apiPut } from './Api'

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

class GenericForm extends React.Component {
    constructor( props ) {
        super( props );

        this.id = this.props.id;
    }

    stateToData( data ) {
        return data;
    }

    stateFromData( data ) {
        return data;
    }

    handleSubmit = ( event ) => {
        event.preventDefault();

        var data = this.stateToData( Object.assign( {}, this.state ) );

        let promise;
        if ( this.id )
            promise = apiPut( `${this.endpoint}/${this.id}`, data );
        else
            promise = apiPost( this.endpoint, data );
        promise.then(() => this.props.history.push( `/${this.endpoint}` ) )
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

    componentDidMount() {
        if ( this.id ) {
            apiGet( `${this.endpoint}/${this.id}` )
                .then( entity => { this.setState( this.stateFromData( entity ) ) } )
                .catch( function( res ) { console.log( res ) } );
        }
    }

    render() {
        let action = this.id ? "Edit" : "Create";
        return (
            <div className="panel">
                <h2>{action} {this.entityName}</h2>
                <form onSubmit={this.handleSubmit}>
                    {this.renderForm()}
                    <button type="submit" className="btn btn-primary">{action}</button>
                </form>
            </div>
        );
    }
}

class AuthorForm extends GenericForm {
    constructor( props ) {
        super( props );
        this.state = { name: "", surname: "" };
        this.endpoint = "authors";
        this.entityName = "author";
    }

    renderForm() {
        return (
            <div>
                <Input type="text" value={this.state.name} onChange={this.handleInputChange} name="name" label="Name" />
                <Input type="text" value={this.state.surname} onChange={this.handleInputChange} name="surname" label="Surname" />
            </div>
        );
    }
}

export class CreateAuthor extends React.Component {
    render() {
        return <AuthorForm />;
    }
}

export class EditAuthor extends React.Component {
    render() {
        return <AuthorForm id={this.props.match.params.id} />;
    }
}

class BookForm extends GenericForm {
    constructor( props ) {
        super( props );
        this.state = { title: "", isbn: "", authors: [] };
        this.endpoint = "books";
        this.entityName = "book";
    }

    stateToData( data ) {
        data.authors = data.authors.map( author => ( { id: author.value } ) );
        return data;
    }

    stateFromData( data ) {
        data.authors = data.authors.map( this.authorValue );
        return data;
    }

    handleAuthorsChange = ( values ) => {
        this.setState( { authors: values } );
    }

    authorValue( author ) {
        return { value: author.id, label: authorString( author ) };
    }

    getAuthors = () => {
        return apiGet( 'authors' )
            .then( authors => {
                return {
                    options: authors.map( this.authorValue )
                };
            } );
    }

    renderForm() {
        return (
            <div>
                <Input type="text" value={this.state.title} onChange={this.handleInputChange} name="title" label="Title" />
                <Input type="text" value={this.state.isbn} onChange={this.handleInputChange} name="isbn" label="ISBN" />
                <Select multi onChange={this.handleAuthorsChange}
                    loadOptions={this.getAuthors} value={this.state.authors}
                    name="authors" label="Authors" />
            </div>
        );
    }
}

export class CreateBook extends React.Component {
    render() {
        return <BookForm />;
    }
}

export class EditBook extends React.Component {
    render() {
        return <BookForm id={this.props.match.params.id} />;
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
                    {this.state.objects.map( object =>
                        <B.ListGroupItem key={object.id}>
                            {this.props.renderObject( object )}
                            <Link className="btn btn-default" to={`${this.props.endpoint}/${object.id}/edit`}>Edit</Link>
                        </B.ListGroupItem>
                    )}
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
    return <ListView endpoint="books" title="All books" renderObject={book => `${book.title} (${authorsString( book.authors )})`} />;
}

export function ListAuthors() {
    return <ListView endpoint="authors" title="All authors" renderObject={authorString} />;
}