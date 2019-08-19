import React from 'react';
import { Consumer } from './SearchContext';

class Search extends React.Component {
}
  handleFormSubmit = (event) => {
    event.preventDefault();
    this.props.search();
  };
  radius_values = ['10', '25', '50', '100', '200'];
  render() {
    return (
      <Consumer>
        {(context) => (
          <div className="search-params">
            <h2>Search Options:</h2>
            <form onSubmit={this.handleFormSubmit}>
              <label htmlFor="species">
                Species
                <select
                  name="species"
                  id="species"
                  defaultValue={context.selectedSpecies}
                  onChange={context.handleSpeciesChange}
                  onBlur={context.handleSpeciesChange}
                >
                  <option />
                  {context.species.map((animalSpecies) => (
                    <option key={animalSpecies} value={animalSpecies}>
                      {animalSpecies}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="Breed">
                Breed
                <select
                  disabled={!context.breeds.length}
                  id="breed"
                  defaultValue={context.breed}
                  onChange={context.handleBreedChange}
                  onBlur={context.handleBreedChange}
                >
                  <option />
                  {context.breeds.map((breed) => (
                    <option value={breed} key={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="location">
                Location
                <input
                  id="location"
                  defaultValue={context.location}
                  placeholder="Zip Code"
                  onChange={context.handleLocationChange}
                />
              </label>
              <label htmlFor="Radius">
                Radius
                <select
                  // Disabled if no location is set
                  disabled={!context.location.length}
                  id="radius"
                  defaultValue={context.radius}
                  onChange={context.handleRadiusChange}
                  onBlur={context.handleRadiusChange}
                >
                  <option />
                  {this.radius_values.map((radius) => (
                    <option value={radius} key={radius}>
                      {radius}
                    </option>
                  ))}
                </select>
              </label>
              <button>Submit</button>
            </form>
          </div>
        )}
      </Consumer>
    );
  }
}

export default Search;
