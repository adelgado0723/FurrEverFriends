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
  state = {
    // TODO: Take zip code as search param. If blank, return results for all zips.
    location: {
      formattedAddress: 'test',
    },
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

  fetchBreedsBySpecies = utils.fetchBreeds.bind(this);
  fetchAllSpecies = utils.fetchSpecies.bind(this);

  handleSpeciesChange = (event) => {
    console.log('In species change');
    this.setState(
      {
        selectedSpecies: event.target.value,
      },
      this.fetchBreedsBySpecies
      // () => this.fetchBreedsBySpecies(event.target.value)
    );
  };
  handleBreedChange = (event) => {
    console.log('In breed change');
    this.setState({
      breed: event.target.value,
    });
  };
  handleLocationChange = (event) => {
    console.log('In location change');
    this.setState({
      location: {
        formattedAddress: event.target.value,
      },
    });
  };
  componentDidMount() {
    // const fetchAllSpecies = utils.fetchSpecies.bind(this);
    this.fetchAllSpecies();
    // this.handleSpeciesChange('Cow');
  }
  render() {
    return (
      <div className="app-root">
        <header>
          <Link to="/">Puppy Love Pet Adoption</Link>
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
