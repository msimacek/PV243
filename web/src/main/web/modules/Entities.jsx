import React from 'react'
import * as B from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import ReactSelect from 'react-select';

import { apiGet, apiPost, apiPut, apiDelete } from './Api'

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
    let str = `${author.name} ${author.surname}`;
    if ( author.diedYear )
        str += ` (${author.bornYear}-${author.diedYear})`;
    else if ( author.bornYear )
        str += ` (${author.bornYear}`;
    return str;
}

function authorsString( authors ) {
    if ( !authors.length )
        return "unknown author";
    return authors.map( authorString ).join( ', ' );
}

function canEdit( role, entity ) {
    if ( role == "admin" )
        return true;
    return false;
}

class GenericForm extends React.Component {
    constructor( props ) {
        super( props );
        this.action = null;
        this.redirect = null;
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
        delete data.validationErrors;

        let promise;
        if ( this.id )
            promise = apiPut( `${this.endpoint}/${this.id}`, data );
        else
            promise = apiPost( this.endpoint, data );
        promise.then(( response ) => {
            if ( response.ok ) {
                this.props.history.push( this.redirect || `/${this.endpoint}` );
            } else {
                return response.json().then( json => {
                    if ( json.parameterViolations ) {
                        var message = json.parameterViolations.map( v => `${v.path.replace( /.*\./, '' )} ${v.message}` ).join( ', ' );
                    } else {
                        var message = json.error;
                    }
                    this.setState( { validationErrors: message } );
                } );
            }
        } )
            .catch( error => {

            } );
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
        if ( !this.endpoint )
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
        let action = this.action || ( this.id ? "Edit" : "Create" );
        return (
            <div className="panel">
                <h2>{action} {this.entityName}</h2>
                {this.state.validationErrors &&
                    <div className="alert alert-danger">
                        {this.state.validationErrors}
                    </div>}
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
        this.redirect = "/authors";
    }

    renderForm() {
        return (
            <div>
                <Input type="text" value={this.state.name} onChange={this.handleInputChange} name="name" label="Name" />
                <Input type="text" value={this.state.surname} onChange={this.handleInputChange} name="surname" label="Surname" />
                <Input type="text" value={this.state.bornYear} onChange={this.handleInputChange} name="bornYear" label="Year of birth" />
                <Input type="text" value={this.state.diedYear} onChange={this.handleInputChange} name="diedYear" label="Year of death" />
            </div>
        );
    }
}

export class UserForm extends GenericForm {
    constructor( props ) {
        super( props );
        this.state = { name: "", surname: "", email: "", password: "", role: "user" };
        this.entityName = "user";
    }

    renderForm() {
        return (
            <div>
                <Input type="text" value={this.state.name} onChange={this.handleInputChange} name="name" label="Name" />
                <Input type="text" value={this.state.surname} onChange={this.handleInputChange} name="surname" label="Surname" />
                <Input type="text" value={this.state.email} onChange={this.handleInputChange} name="email" label="Email" />
                <Input type="password" value={this.state.password} onChange={this.handleInputChange} name="password" label="Password" />
                <Input type="text" value={this.state.role} onChange={this.handleInputChange} name="role" label="Role" />
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

export class ReturnForm extends GenericForm {
    constructor( props ) {
        super( props );
        this.state = { barcodeId: "" };
        this.entityName = "volume";
        this.action = "Return";
        this.endpoint = "/volumes/return"
    }

    renderForm() {
        return (
            <div>
                <Input type="text" value={this.state.barcodeId} onChange={this.handleInputChange} name="barcodeId" label="Volume barcode ID" />
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
            filter: "",
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

    handleFilterChange = ( event ) => {
        this.setState( { filter: event.target.value } );
    }

    render() {
        let content;
        if ( this.state.error )
            content = <div>Loading error: {this.state.error.message}</div>;
        else if ( !this.state.loaded )
            content = <div>Loading</div>;
        else if ( !this.state.objects.length )
            content = <div>No entities in the database</div>;
        else {
            let objects = this.state.objects;
            if (this.state.filter)
                objects = objects.filter(item => JSON.stringify(item).toLowerCase().includes(this.state.filter.toLowerCase()));
            content = (
                <B.ListGroup>
                    {objects.map( object =>
                        <Link key={object.id} to={`/${this.props.endpoint}/${object.id}`} className="list-group-item list-group-item-action">
                            {this.props.renderObject( object )}
                        </Link>
                    )}
                </B.ListGroup>
            );
        }
        return (
            <div>
                <h2>{this.props.title}</h2>
                <form className="form-inline">
                    <div className="form-group has-feedback">
                        <input className="form-control" type="text" value={this.state.filter} onChange={this.handleFilterChange} />
                        <i className="glyphicon glyphicon-search form-control-feedback"></i>
                    </div>
                </form>
                {content}
            </div>
        );
    }
}

export function ListBooks() {
    return <ListView endpoint="books" title="All books" renderObject={book => `${book.title} - ${authorsString( book.authors )}`} />;
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
        this.state = { loaded: false, error: null };
        this.id = this.props.id || this.props.match.params.id;
    }

    handleDelete = () => {
        if ( confirm( "Really delete?" ) ) {
            apiDelete( `${this.endpoint}/${this.id}` )
                .then(( response ) => {
                    if ( response.ok )
                        this.props.history.push( `/${this.endpoint}` );
                    else
                        this.setState( { error: response.statusText } );
                } );
        }
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
                <h2>{this.entityName} detail</h2>
                {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
                {canEdit( this.props.user.role, this.entityName ) &&
                    <div>
                        <Link className="btn btn-default" to={`/${this.endpoint}/${this.state.id}/edit`}>Edit</Link>
                        <a href="#" className="btn btn-default" onClick={this.handleDelete}>Delete</a>
                    </div>}
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
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>State</th>
                                    <th>Barcode ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.volumes.map( volume =>
                                    <tr key={volume.id}>
                                        <td>{( volume.lent === false ) ? "Available" : "Lent"}</td>
                                        <td>{volume.barcodeId}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export class UserDetail extends GenericDetail {
    constructor( props ) {
        super( props );
        this.endpoint = "users";
        this.entityName = "User";
    }

    renderDetail() {
        return (
            <div>
                <dl className="dl-horizontal">
                    <dt>Name</dt><dd>{this.state.name}</dd>
                    <dt>Surname</dt><dd>{this.state.surname}</dd>
                    <dt>Email</dt><dd>{this.state.email}</dd>
                </dl>
                <div className="panel panel-default">
                    <div className="panel-heading">Loans</div>
                    <div className="panel-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Author</th>
                                    <th>Loan date</th>
                                    <th>Return date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.loans.map( loan =>
                                    <tr key={loan.id}>
                                        <td>{loan.volume.book.title}</td>
                                        <td>{authorsString( loan.volume.book.authors )}</td>
                                        <td>{loan.loanDate}</td>
                                        <td>{loan.returnDate}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export class AuthorDetail extends GenericDetail {
    constructor( props ) {
        super( props );
        this.endpoint = "authors";
        this.entityName = "Author";
    }

    renderDetail() {
        return (
            <div>
                <dl className="dl-horizontal">
                    <dt>Name</dt><dd>{this.state.name}</dd>
                    <dt>Surname</dt><dd>{this.state.surname}</dd>
                    <dt>Date of birth</dt><dd>{this.state.bornYear}</dd>
                    <dt>Date of death</dt><dd>{this.state.diedYear}</dd>
                </dl>
                <div className="panel panel-default">
                    <div className="panel-heading">Books</div>
                    <div className="panel-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.books.map( book =>
                                    <tr key={book.id}>
                                        <td>{book.title}</td>
                                        <td>{book.description}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}