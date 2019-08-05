import React from 'react';
import ReactDOM from 'react-dom';
import Results from './Results.js';
import Details from './Details.js';
import SearchParams from './SearchParams.js';
import { Router, Link } from '@reach/router';
import { Provider } from './SearchContext';
import getUtilities from './Utilities';

const utils = getUtilities();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO: Take zip code as search param. If blank, return results for all zips.
      location: '',
      selectedSpecies: '',
      species: [],
      breeds: [],
      breed: '',
      loading: true,
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
          <Link to="/">FurrEver Friends</Link>
          <Link to="/search-params">
            <span aria-label="search" role="img" className="search-icon">
              🔍
            </span>
          </Link>
        </header>
        <Provider value={this.state}>
          <div className="site-wrap">
            <Router>
              <Results path="/" />
              <Details path="details/:id" />
              <SearchParams path="/search-params" />
            </Router>
          </div>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
