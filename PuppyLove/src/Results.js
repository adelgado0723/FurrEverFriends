import React from 'react';
import Animal from './Animal';
import getUtilities from './Utilities';

const utils = getUtilities();

class Results extends React.Component {
  state = {
    animals: [],
    loading: true,
  };

  componentDidMount() {
    // const params = [
    //   {
    //     fieldName: 'animalBreed',
    //     operation: 'equal',
    //     criteria: 'English Bulldog',
    //   },
    // ];
    const fetchAllAnimals = utils.fetchAnimals.bind(this);
    fetchAllAnimals();
    // fetchAllAnimals(params);
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
    return (
      <div>
        {/* <pre>
          <code>{JSON.stringify(this.state, null, 2)}</code>
        </pre> */}
        {fetchedAnimals}
      </div>
    );
  }
}
export default Results;
