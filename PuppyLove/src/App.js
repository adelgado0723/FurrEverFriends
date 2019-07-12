import React from 'react';
import ReactDOM from 'react-dom';
import Results from './Results.js';
import Details from './Details.js';
import { Router, Link } from '@reach/router';

class App extends React.Component {
  render() {
    return (
      <div className="app-root">
        <header>
          <Link to="/">Puppy Love Pet Adoption</Link>
        </header>
        <div className="site-wrap">
          <Router>
            <Results path="/" />
            <Details path="details/:id" />
          </Router>
        </div>
      </div>
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
