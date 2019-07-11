import React from "react";
import Animal from "./Animal";
let utils = require('./Utilities');


class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animals: []
    };
  }

  componentDidMount() {
    const fetchAllAnimals = utils.fetchAnimals.bind(this);
    fetchAllAnimals();
  }

  render() {
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
export default Results