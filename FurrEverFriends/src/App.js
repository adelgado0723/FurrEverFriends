import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { Router, Link } from '@reach/router';
import { Provider } from './SearchContext';
import getUtilities from './Utilities';

const utils = getUtilities();

// Loading components independently
const LoadableDetails = Loadable({
  loader: () => import('./Details'),
  loading() {
    return <h1>Loading split Details code...</h1>;
  },
});
const LoadableResults = Loadable({
  loader: () => import('./Results'),
  loading() {
    return <h1>Loading split Results code...</h1>;
  },
});
const LoadableSearchParams = Loadable({
  loader: () => import('./SearchParams'),
  loading() {
    return <h1>Loading split SearchParams code...</h1>;
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      selectedSpecies: '',
      species: [],
      breeds: [],
      breed: '',
      radius: '',
      handleRadiusChange: this.handleRadiusChange,
      fetchAllSpecies: this.fetchAllSpecies,
      fetchBreedsBySpecies: this.fetchBreedsBySpecies,
      handleSpeciesChange: this.handleSpeciesChange,
      handleBreedChange: this.handleBreedChange,
      handleLocationChange: this.handleLocationChange,
    };
  }
  fetchAllSpecies = utils.fetchSpecies.bind(this);
  fetchBreedsBySpecies = utils.fetchBreeds.bind(this);

  handleSpeciesChange = (event) => {
    this.setState(
      {
        selectedSpecies: event.target.value,
      },
      this.fetchBreedsBySpecies
    );
  };
  handleBreedChange = (event) => {
    this.setState({
      breed: event.target.value,
    });
  };

  handleRadiusChange = (event) => {
    this.setState({
      radius: event.target.value,
    });
  };

  handleLocationChange = (event) => {
    this.setState({
      location: event.target.value,
    });
  };
  componentDidMount() {
    // Fetching list of all species to populate select input
    this.fetchAllSpecies();
  }
  render() {
    return (
      <div className="app-root">
        <header>
          <Link to="/" className="title">
            <span className="title-first">FurrEver</span>{' '}
            <span className="title-first">Friends</span>
          </Link>
          <Link to="/search-params">
            <span aria-label="search" role="img" className="search-icon">
              🔍
            </span>
          </Link>
        </header>
        <Provider value={this.state}>
          <div className="site-wrap">
            <Router>
              <LoadableResults path="/" />
              <LoadableDetails path="details/:id" />
              <LoadableSearchParams path="/search-params" />
            </Router>
          </div>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
