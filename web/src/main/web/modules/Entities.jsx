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
        delete data.loaded;

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

    populate() {
        if ( this.id ) {
            apiGet( `${this.endpoint}/${this.id}` )
                .then( entity => {
                    if ( this.mounted ) {
                        this.setState( this.stateFromData( entity ) );
                        this.setState( { loaded: true } );
                    }
                } )
                .catch( res => {
                    if ( this.mounted )
                        this.setState( { error: res } );
                } );
        }
    }

    componentDidMount() {
        this.id = this.props.match.params.id;
        this.setState( { loaded: false } );
        this.initialState = Object.assign( {}, this.state );
        this.endpoint = `${this.entityName}s`;
        this.mounted = true;
        this.populate();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentWillReceiveProps( newProps ) {
        if ( this.id !== newProps.match.params.id ) {
            this.id = newProps.match.params.id;
            this.setState( this.initialState );
            this.populate();
        }
    }

    render() {
        if ( this.state.error )
            return <div>Error: {this.state.error}</div>;
        if ( this.id && !this.state.loaded )
            return <div>Loading</div>;
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

export class AuthorForm extends GenericForm {
    constructor( props ) {
        super( props );
        this.state = { name: "", surname: "" };
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

export class UserForm extends GenericForm {
    constructor( props ) {
        super( props );
        this.state = { name: "", surname: "", email: "" };
        this.entityName = "user";
    }

    renderForm() {
        return (
            <div>
                <Input type="text" value={this.state.name} onChange={this.handleInputChange} name="name" label="Name" />
                <Input type="text" value={this.state.surname} onChange={this.handleInputChange} name="surname" label="Surname" />
                <Input type="text" value={this.state.email} onChange={this.handleInputChange} name="email" label="Email" />
            </div>
        );
    }
}

class Volumes extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { volumes: [] };
        this.index = 0;
    }

    propagateState() {
        if ( this.props.onChange ) {
            let value = this.state.volumes
                .filter( volume => volume.barcodeId )
                .map( volume => ( { barcodeId: volume.barcodeId } ) );
            this.props.onChange( value );
        }
    }

    handleAddVolume = () => {
        this.setState( prevState => ( { volumes: [...prevState.volumes, { index: this.index++, barcodeId: "" }] } ) );
        this.propagateState();
    }

    handleVolumeChange( index ) {
        return event => {
            let barcodeId = event.target.value;
            this.setState( prevState => (
                { volumes: prevState.volumes.map( volume => ( volume.index === index ) ? { index: volume.index, barcodeId: barcodeId } : volume ) }
            ) );
            this.propagateState();
        }
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Volumes</div>
                <div className="panel-body">
                    {
                        this.state.volumes.map( volume =>
                            <div className="row form-group" key={volume.index}>
                                <div className="col-xs-2">
                                    <label>Barcode ID</label>
                                </div>
                                <div className="col-xs-3">
                                    <input className="form-control" size="60" type="text" value={volume.barcodeId}
                                        onChange={this.handleVolumeChange( volume.index )} />
                                </div>
                            </div>
                        )
                    }
                    <div className="form-group">
                        <button type="button" className="btn btn-default" onClick={this.handleAddVolume}>Add volume</button>
                    </div>
                </div>
            </div>
        );
    }
}

export class BookForm extends GenericForm {
    constructor( props ) {
        super( props );
        this.state = { title: "", isbn: "", authors: [], volumes: [] };
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
                <Volumes onChange={( volumes ) => this.setState( { volumes: volumes } )} />
            </div>
        );
    }
}

export class LoanForm extends GenericForm {
    constructor( props ) {
        super( props );
        this.state = { volume: "", user: "" };
        this.entityName = "loan";
    }

    stateToData( state ) {
        return {
            volume: { barcodeId: state.volume },
            user: { email: state.user },
        };
    }

    dataToState( data ) {
        return {
            volume: data.volume.barcodeId,
            user: data.user.email,
        };
    }

    renderForm() {
        return (
            <div>
                <Input type="text" value={this.state.user} onChange={this.handleInputChange} name="user" label="User email" />
                <Input type="text" value={this.state.volume} onChange={this.handleInputChange} name="volume" label="Volume barcode ID" />
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
                    {this.state.objects.map( object =>
                        <Link key={object.id} to={`/${this.props.endpoint}/${object.id}`} className="list-group-item list-group-item-action">
                            {this.props.renderObject( object )}
                        </Link>
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

export function ListUsers() {
    return <ListView endpoint="users" title="All users" renderObject={user => `${user.name} ${user.surname} (${user.email})`} />;
}

class GenericDetail extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { loaded: false };
        this.id = this.props.match.params.id;
    }

    componentDidMount() {
        apiGet( `${this.endpoint}/${this.id}` )
            .then( entity => {
                entity.loaded = true;
                this.setState( entity );
            } );
    }

    render() {
        if ( !this.state.loaded )
            return <div>Loading</div>;
        return (
            <div>
                <h2>{this.entityName} detail - {this.state.title}</h2>
                <Link className="btn btn-default" to={`/${this.endpoint}/${this.state.id}/edit`}>Edit</Link>
                {this.renderDetail()}
            </div>
        );
    }
}

export class BookDetail extends GenericDetail {
    constructor( props ) {
        super( props );
        this.endpoint = "books";
        this.entityName = "Book";
    }

    renderDetail() {
        return (
            <div>
                <dl className="dl-horizontal">
                    <dt>Title</dt><dd>{this.state.title}</dd>
                    <dt>Authors</dt><dd>{authorsString( this.state.authors )}</dd>
                    <dt>ISBN</dt><dd>{this.state.isbn}</dd>
                    <dt>Description</dt><dd>{this.state.description}</dd>
                </dl>
                <div className="panel panel-default">
                    <div className="panel-heading">Volumes</div>
                    <div className="panel-body">
                        {this.state.volumes.map( volume =>
                            <div>{volume.lent ? "Available" : "Lent"} {volume.barcodeId}</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}