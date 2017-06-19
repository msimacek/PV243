import React from 'react'
import { BrowserRouter, Switch, Route, Link, withRouter } from 'react-router-dom'
import '../style.css'
import 'react-select/dist/react-select.css'
import {
    BookForm, ListBooks, BookDetail, AuthorForm, ListAuthors,
    UserForm, ListUsers, UserDetail, LoanForm, ReturnForm,
} from './Entities'
import { logIn, logOut, tryLoginFromCookie, credentials } from './Api'

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
                    {this.props.canCreate && <NavItem to="/books/create">Create book</NavItem>}
                    <NavItem to="/authors">List authors</NavItem>
                    {this.props.canCreate && <NavItem to="/authors/create">Create author</NavItem>}
                    <NavItem to="/users">List users</NavItem>
                    {this.props.canCreate && <NavItem to="/users/create">Create user</NavItem>}
                    {this.props.canCreate && <NavItem to="/loans/create">Create loan</NavItem>}
                    {this.props.canCreate && <NavItem to="/return">Return books</NavItem>}
                </ul>
            </nav>
        );
    }
}

class Login extends React.Component {
    handleSubmit = ( event ) => {
        event.preventDefault();
        logIn( this.refs.email.value, this.refs.password.value )
            .then( this.props.onLogin );
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
        tryLoginFromCookie();
        this.state = {
            user: credentials.user,
        };
    }

    handleLogin = () => {
        this.setState( {
            user: credentials.user,
        } );
        this.props.history.push( "/" );
    }

    handleLogout = () => {
        logOut();
        this.setState( { user: null } );
        this.props.history.push( "/" );
    }

    render() {
        return (
            <div>
                <NavBar canCreate={this.state.user && this.state.user.role == "admin"} />
                <nav className="navbar container">
                    <ul className="nav navbar-nav">
                        {this.state.user &&
                            <li className="nav-item"><span className="navbar-text">Logged in as {this.state.user.email}</span></li>}
                        {this.state.user ?
                            <li className="nav-item"><a onClick={this.handleLogout} href="#">Log out</a></li>
                            : <NavItem to="/login">Log in</NavItem>
                        }
                        {this.state.user &&
                            <li className="nav-item"><Link to={`/users/${this.state.user.id}`}>User profile</Link></li>}
                    </ul>
                </nav>
                <div className="container">
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
                        <Route exact path="/return" component={ReturnForm} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default class App extends React.Component {
    render() {
        var BaseComponent = withRouter( Base );
        return (
            <BrowserRouter>
                <BaseComponent />
            </BrowserRouter>
        );
    }
}