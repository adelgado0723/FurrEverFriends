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

  fetchAllSpecies = () => {
    const speciesQueryConnection = {
      apikey: process.env.API_KEY,
      objectType: 'animalSpecies',
      objectAction: 'publicList',
    };

    const listSpeciesPromise = fetch(utils.API_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        // Accept: 'application/json',
      },
      body: JSON.stringify(speciesQueryConnection),
    });
    const listSpeciesJSON = listSpeciesPromise.then((response) => {
      const processingPromise = response.json();
      // console.log(`In Processing: ${processingPromise}`);
      return processingPromise;
    });
    listSpeciesJSON.then((processedResponse) => {
      // Second then is to wait on the JSON parsing
      let species = [];
      if (processedResponse && processedResponse.data) {
        for (let key in processedResponse.data) {
          species.push(key);
        }
      }

      this.setState({
        species,
        // loading: false,
      }).catch((err) =>
        this.setState({
          error: err,
        })
      );
      // console.table(species);
    });
  };

  fetchBreedsBySpecies = (species = '') => {
    // const species = 'Dog';
    if (!species) {
      species = this.state.selectedSpecies;
    }
    const breedQueryParams = [
      {
        fieldName: 'breedSpecies',
        operation: 'equals',
        criteria: species,
      },
    ];

    const breedQueryConnection = {
      apikey: process.env.API_KEY,
      objectType: 'animalBreeds',
      objectAction: 'publicSearch',
      search: {
        resultStart: '0',
        resultLimit: '10',
        resultSort: 'breedName',
        resultOrder: 'asc',
        calcFoundRows: 'Yes',
        filters: breedQueryParams,
        fields: ['breedName'],
      },
    };

    const listBreedsPromise = fetch(utils.API_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        // Accept: 'application/json',
      },
      body: JSON.stringify(breedQueryConnection),
    });
    const listBreedsJSON = listBreedsPromise.then((response) => {
      const processingPromise = response.json();
      // console.log(`In Processing: ${processingPromise}`);
      return processingPromise;
    });
    listBreedsJSON.then((processedResponse) => {
      let breeds = [];
      // console.log(processedResponse);
      if (processedResponse && processedResponse.data) {
        for (let key in processedResponse.data) {
          if (species !== processedResponse.data[key].breedName) {
            breeds.push(processedResponse.data[key].breedName);
          }
        }
      }
      this.setState({
        breeds,
      }).catch((err) =>
        this.setState({
          error: err,
        })
      );
      // console.log(breeds);
    });
  };
  // fetchBreedsBySpecies = utils.fetchBreeds.bind(this);
  // fetchAllSpecies = utils.fetchSpecies.bind(this);

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
          <Link to="/">Puppy Love Pet Adoption</Link>
          <Link to="/search-params">
            <span aria-label="search" role="img">
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
