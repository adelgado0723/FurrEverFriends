import React from 'react';
import { Consumer } from './SearchContext';

class Search extends React.Component {
  test = () => {
    console.log(this.state.species);
  };
  render() {
    return (
      <Consumer>
        {(context) => (
          <div className="search-params">
            <form>
              <label htmlFor="location">
                Location
                <input
                  id="location"
                  defaultValue={context.location.formattedAddress}
                  placeholder="Location"
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
