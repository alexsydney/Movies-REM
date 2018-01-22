import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'
import './App.css';
import AboutPage from './pages/AboutPage'
import MoviesPage from './pages/MoviesPage'
import MovieForm from './components/MovieForm'
import SignInForm from './components/SignInForm'
import SignOutForm from './components/SignOutForm'

import * as moviesAPI from './api/movies'

export function getMovies() {
  return moviesAPI.all()
    .then(movies => {
      movies
    })
}

import * as auth from './api/auth'

class App extends Component {
  state = { movies: null }

  componentDidMount() {
    getMovies()
      .then((movies) => {
        this.setState({ movies })
      })
  }

  handleMovieSubmission = (movie) => {
    moviesAPI.save(movie);
    this.setState(({ movies }) => (
      { movies: [movie].concat(movies) }
    ));
  }

  handleSignIn = (event) => {
    event.preventDefault()
    const form = event.target
    const elements = form.elements
    const email = elements.email.value
    const password = elements.password.value
    auth.signIn({ email, password })
      .then(() => (
        moviesAPI.all()
          .then(movies => {
            this.setState({ movies })
          })
        )
      )
  }

  handleSignOut = () => {
    auth.signOut()
    this.setState({ movies: null })
  }

  render() {
    const { movies } = this.state;
    return (
      <Router>
        <div className="App">
          <nav>
            <Link to='/about'>About</Link>
            &nbsp;
            <Link to='/movies'>Movies</Link>
            &nbsp;
            <Link to='/movies/new'>Create</Link>
            &nbsp;
            <Link to='/signin'>Sign In</Link>
            &nbsp;
            <Link to='/signout'>Sign Out</Link>
          </nav>
          <hr/>
          <Switch>
            <Route path='/about' component={AboutPage} />
            <Route path='/movies/new' render={() => ( 
                <MovieForm onSubmit={ this.handleMovieSubmission }/>
              )
            }/>
            <Route path='/movies' render={() => (
                <MoviesPage movies={movies}/>
              )
            }/>
            <Route path='/signin' render={() => (
              <div>
                { auth.isSignedIn() && <Redirect to='/movies'/> }
                <SignInForm onSignIn={ this.handleSignIn }/>
              </div>
            )}/>
            <Route path='/signout' render={() => (
              <SignOutForm onSignOut={ this.handleSignOut }/>
            )}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
