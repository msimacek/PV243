import React from 'react'
import { BrowserRouter, Switch, Route, Link, withRouter } from 'react-router-dom'
import '../style.css'
import { CreateBook, ListBooks } from './Books'

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
            <nav className="navbar">
                <div className="navbar-header">
                    <a className="navbar-brand" href="#">Library manager</a>
                </div>
                <ul className="nav navbar-nav">
                    <NavItem to="/book/create">Create book</NavItem>
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
                <Switch>
                    <Route exact path="/" component={ListBooks} />
                    <Route path="/book/create" component={CreateBook} />
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