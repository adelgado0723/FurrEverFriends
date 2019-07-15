import React from 'react';
import getUtilities from './Utilities';

const utils = getUtilities();

class Search extends React.Component {
  state = {
    // TODO: Tke zip code as search param. If blank, return results for all zips.
    location: {
      formattedAddress: 'test',
    },
    selectedSpecies: 'speciesTest',
    species: [],
    breeds: [],
    breed: '',
    loading: true,
  };
  fetchBreedsBySpecies = utils.fetchBreeds.bind(this);

  handleSpeciesChange = (event) => {
    this.setState(
      {
        selectedSpecies: event.target.value,
      },
      () => this.fetchBreedsBySpecies(this.state.selectedSpecies)
    );
  };
  handleBreedChange = (event) => {
    this.setState({
      breed: event.target.value,
    });
  };
  handleLocationChange = (event) => {
    this.setState({
      location: {
        formattedAddress: event.target.value,
      },
    });
  };
  componentDidMount() {
    const fetchAllSpecies = utils.fetchSpecies.bind(this);
    fetchAllSpecies();
  }
  render() {
    return (
      <div className="search-params">
        <label htmlFor="location">
          Location
          <input
            id="location"
            value={this.state.location.formattedAddress}
            placeholder="Location"
            onChange={this.handleLocationChange}
          />
        </label>
        <label htmlFor="species">
          Species
          <select
            name="species"
            id="species"
            value={this.state.selectedSpecies}
            onChange={this.handleSpeciesChange}
            onBlur={this.handleSpeciesChange}
          >
            <option />
            {this.state.species.map((animalSpecies) => (
              <option key={animalSpecies} value={animalSpecies}>
                {animalSpecies}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="Breed">
          Breed
          <select
            disabled={!this.state.breeds.length}
            id="breed"
            value={this.state.breed}
            onChange={this.handleBreedChange}
            onBlur={this.handleBreedChange}
          >
            <option />
            {this.state.breeds.map((breed) => (
              <option value={breed} key={breed}>
                {breed}
              </option>
            ))}
          </select>
        </label>
        <button>Submit</button>
      </div>
    );
  }
}

export default Search;
