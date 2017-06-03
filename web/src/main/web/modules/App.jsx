import React from 'react'
import { BrowserRouter, Switch, Route, Link, withRouter } from 'react-router-dom'
import '../style.css'
import 'react-select/dist/react-select.css'
import { BookForm, ListBooks, BookDetail, AuthorForm, ListAuthors, UserForm, ListUsers } from './Entities'

class NavItem extends React.Component {
    render() {
        return (
            <li className="nav-item">
                <Link to={this.props.to}>{this.props.children}</Link>
            </li>
        );
    }
}

class NavBar extends React.Component {
    render() {
        return (
            <nav className="navbar container">
                <div className="navbar-header">
                    <a className="navbar-brand" href="#">Library manager</a>
                </div>
                <ul className="nav navbar-nav">
                    <NavItem to="/books">List books</NavItem>
                    <NavItem to="/books/create">Create book</NavItem>
                    <NavItem to="/authors">List authors</NavItem>
                    <NavItem to="/authors/create">Create author</NavItem>
                    <NavItem to="/users">List users</NavItem>
                    <NavItem to="/users/create">Create user</NavItem>
                </ul>
            </nav>
        );
    }
}

class Base extends React.Component {
    render() {
        return (
            <div>
                <NavBar />
                <div className="container">
                    <Switch>
                        <Route exact path="/" component={ListBooks} />
                        <Route exact path="/books" component={ListBooks} />
                        <Route exact path="/books/create" component={BookForm} />
                        <Route exact path="/books/:id" component={BookDetail} />
                        <Route exact path="/books/:id/edit" component={BookForm} />
                        <Route exact path="/authors" component={ListAuthors} />
                        <Route exact path="/authors/create" component={AuthorForm} />
                        <Route exact path="/authors/:id/edit" component={AuthorForm} />
                        <Route exact path="/users" component={ListUsers} />
                        <Route exact path="/users/create" component={UserForm} />
                        <Route exact path="/users/:id/edit" component={UserForm} />
                    </Switch>
                </div>
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