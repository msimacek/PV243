import React from 'react'
import * as B from 'react-bootstrap';
import { BrowserRouter, Switch, Route, Link, withRouter } from 'react-router-dom'
import '../style.css'

class CreateBook extends React.Component {
    handleSubmit( event ) {
        event.preventDefault();

        var data = JSON.stringify( {
            title: this.refs.title.value,
            isbn: this.refs.isbn.value,
            authors: [],
        } );
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        fetch( "/rest/books", { method: "POST", body: data, headers: headers } )
            .then( () => this.props.history.push("/") )
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

class BookList extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { books: [] };
    }

    componentDidMount() {
        fetch( "/rest/books" )
            .then( response => response.json() )
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

class Base extends React.Component {
    render() {
        return (
            <div>
                <Link to="/create">Create</Link>
                <Switch>
                    <Route exact path="/" component={BookList} />
                    <Route path="/create" component={withRouter(CreateBook)} />
                </Switch>
            </div>
        )
    }
}

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Base />
            </BrowserRouter>
        );
    }
}