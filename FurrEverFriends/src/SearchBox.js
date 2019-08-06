import React from 'react';
import { Provider, Consumer } from './SearchContext';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  handleFormSubmit = (event) => {
    event.preventDefault();
    this.state.loading = true;
    this.props.search();
  };
  render() {
    return (
      <Consumer>
        {(context) => (
          <div className="search-params">
            <form onSubmit={this.handleFormSubmit}>
              <label htmlFor="location">
                Zip Code
                <input
                  id="location"
                  defaultValue={context.location}
                  placeholder="Zip Code"
                  onChange={context.handleLocationChange}
                />
              </label>
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
              <button>Submit</button>
            </form>
          </div>
        )}
      </Consumer>
    );
  }
}

export default Search;
