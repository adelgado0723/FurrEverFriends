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
      pageNumber: 0,
      startingAnimalIndex: -1,
      resultLimit: -1,
    };
  }
  fetchAnimals = utils.fetchAnimals.bind(this);

  componentDidMount() {
    this.fetchAnimals();
  }

  getNextPage = () => {
    if (this.state.pageNumber === this.state.numPages) {
      return;
    }
    const nextStartingAnimal =
      this.state.startingAnimalIndex + this.state.resultLimit;
    this.fetchAnimals(nextStartingAnimal.toString());
  };

  getPrevPage = () => {
    if (this.state.pageNumber === 1) {
      return;
    }
    const prevStartingAnimal =
      this.state.startingAnimalIndex - this.state.resultLimit;
    this.fetchAnimals(prevStartingAnimal.toString());
  };

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
          details={{
            birthdate: animal.animalBirthdate,
            color: animal.animalColor,
            age: animal.animalGeneralAge,
            'potential size': animal.animalGeneralSizePotential,
            housetrained: animal.animalHousetrained,
            gender: animal.animallSex,
            'primary breed': animal.animalPrimaryBreed,
          }}
        />
      );
    }

    const nav = (
      <div className="page-nav">
        <span
          aria-label="previous page"
          role="img"
          className={this.state.pageNumber === 1 ? 'disabled' : ''}
          onClick={this.getPrevPage}
        >
          ◀
        </span>
        <div className="page">
          Page {this.state.pageNumber} of {this.state.numPages}
        </div>
        <span
          aria-label="next page"
          role="img"
          className={
            this.state.pageNumber === this.state.numPages ? 'disabled' : ''
          }
          onClick={this.getNextPage}
        >
          ►
        </span>
      </div>
    );

    let results = [];
    if (this.state.numAnimals) {
      results = fetchedAnimals;
    } else {
      results = <h1>No Results Found...</h1>;
    }
    return (
      <div className="search">
        {/* <pre>
          <code>{JSON.stringify(this.state.animals, null, 2)}</code>
        </pre> */}
        <SearchBox search={this.fetchAnimals} />
        <div>
          {results}
          {this.state.numAnimals ? nav : null}
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
