import React from 'react'
import { BrowserRouter, Switch, Route, Link, withRouter } from 'react-router-dom'
import '../style.css'
import 'react-select/dist/react-select.css'
import { BookForm, ListBooks, BookDetail, AuthorForm, ListAuthors, UserForm, ListUsers, UserDetail, LoanForm } from './Entities'
import { logIn, logOut, credentials } from './Api'

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
                    <NavItem to="/login">Log in</NavItem>
                    <NavItem to="/books">List books</NavItem>
                    <NavItem to="/books/create">Create book</NavItem>
                    <NavItem to="/authors">List authors</NavItem>
                    <NavItem to="/authors/create">Create author</NavItem>
                    <NavItem to="/users">List users</NavItem>
                    <NavItem to="/users/create">Create user</NavItem>
                    <NavItem to="/loans/create">Create loan</NavItem>
                </ul>
            </nav>
        );
    }
}

class Login extends React.Component {
    handleSubmit = ( event ) => {
        event.preventDefault();
        logIn( this.refs.email.value, this.refs.password.value )
            .then(this.props.onLogin);
    }

    render() {
        return (
            <div>
                <h2>Log in </h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" className="form-control" ref="email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input className="form-control" type="password" ref="password" />
                    </div>
                    <div className="form-group">
                        <button type="submit">Log in</button>
                    </div>
                </form>
            </div>
        );
    }
}

class Base extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { email: null };
    }

    handleLogin = () => {
        this.setState( { email: credentials.email } );
        this.props.history.push( "/" );
    }

    handleLogout = () => {
        logOut();
        this.setState( { email: null } );
        this.props.history.push( "/" );
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="container">
                    {this.state.email && <div>
                        Logged in as {this.state.email}
                        <button type="button" onClick={this.handleLogout}>Log out</button>
                    </div>}
                    <Switch>
                        <Route exact path="/" component={ListBooks} />
                        <Route exact path="/login" component={( props ) => <Login onLogin={this.handleLogin} {...props} />} />
                        <Route exact path="/books" component={ListBooks} />
                        <Route exact path="/books/create" component={BookForm} />
                        <Route exact path="/books/:id" component={BookDetail} />
                        <Route exact path="/books/:id/edit" component={BookForm} />
                        <Route exact path="/authors" component={ListAuthors} />
                        <Route exact path="/authors/create" component={AuthorForm} />
                        <Route exact path="/authors/:id/edit" component={AuthorForm} />
                        <Route exact path="/users" component={ListUsers} />
                        <Route exact path="/users/create" component={UserForm} />
                        <Route exact path="/loans/create" component={LoanForm} />
                        <Route exact path="/users/:id" component={UserDetail} />
                        <Route exact path="/users/:id/edit" component={UserForm} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default class App extends React.Component {
    render() {
        var BaseComponent = withRouter(Base);
        return (
            <BrowserRouter>
                <BaseComponent />
            </BrowserRouter>
        );
    }
}