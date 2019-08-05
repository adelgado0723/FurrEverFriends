import React from 'react';
import Animal from './Animal.js';
import getUtilities from './Utilities.js';
import SearchBox from './SearchBox.js';
import { Consumer } from './SearchContext.js';

require('dotenv').config();
const utils = getUtilities();

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animals: [],
      loading: false,
      numAnimals: 0,
      numPages: 0,
    };
  }
  fetchAnimals = utils.fetchAnimals.bind(this);

  componentDidMount() {
    this.fetchAnimals();
  }

  render() {
    if (this.state.loading) {
      return <h1> LOADING RESULTS... </h1>;
    }
    const fetchedAnimals = [];

    for (let id in this.state.animals) {
      const animal = this.state.animals[id];
      fetchedAnimals.push(
        // TODO: add more fields like: description, sex, primary breed (instead of breed)...
        <Animal
          name={animal.animalName}
          species={animal.animalSpecies}
          breed={animal.animalBreed}
          media={animal.animalPictures}
          location={animal.location}
          key={animal.animalID}
          id={animal.animalID}
          description={animal.animalDescription}
        />
      );
    }
    // if (this.state.numAnimals === 0) {
    //   fetchedAnimals.push(<h1>No Results Found...</h1>);
    // }

    return (
      <div className="search">
        {/* <pre>
          <code>{JSON.stringify(this.state.animals, null, 2)}</code>
        </pre> */}
        <SearchBox search={this.fetchAnimals} />
        <div>
          {this.state.numAnimals ? (
            fetchedAnimals
          ) : (
            <h1>No Results Found...</h1>
          )}
        </div>
      </div>
    );
  }
}
export default function ResultsWithContext(props) {
  return (
    <Consumer>
      {(context) => <Results {...props} searchParams={context} />}
    </Consumer>
  );
}
