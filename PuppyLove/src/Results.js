import React from 'react';
import Animal from './Animal.js';
import getUtilities from './Utilities.js';
import SearchBox from './SearchBox.js';
import { Consumer } from './SearchContext.js';
import { thisExpression } from '@babel/types';
// import { tsConstructSignatureDeclaration } from '@babel/types';

require('dotenv').config();
const utils = getUtilities();

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animals: [],
      loading: false,
    };
  }
  // TO get fetchAnimals function from context:
  // fetchAnimals = this.props.searchParams.fetchAnimals.bind(this);
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
        <Animal
          name={animal.animalName}
          species={animal.animalSpecies}
          breed={animal.animalBreed}
          media={animal.animalPictures}
          location={animal.location}
          key={animal.animalID}
          id={animal.animalID}
        />
      );
    }
    if (fetchedAnimals.length === 0) {
      fetchedAnimals.push(<h1>No Results Found...</h1>);
    }

    return (
      <div className="search">
        {/* <pre>
          <code>{JSON.stringify(this.state, null, 2)}</code>
        </pre> */}
        <SearchBox search={this.fetchAnimals} />

        {fetchedAnimals}
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
