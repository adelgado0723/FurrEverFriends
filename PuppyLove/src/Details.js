import React from 'react';
import Carousel from './Carousel.js';
import getUtilities from './Utilities';

const utils = getUtilities();

class Details extends React.Component {
  state = {
    loading: true,
  };
  componentDidMount() {
    const params = [
      {
        fieldName: 'animalID',
        operation: 'equal',
        criteria: this.props.id,
      },
    ];

    const fetchByID = utils.fetchAnimals.bind(this);
    fetchByID(params);
  }
  render() {
    if (this.state.loading) {
      return <h1> LOADING DETAILS... </h1>;
    }
    const animal = this.state.animals[this.props.id];
    // console.log(animal);
    return (
      <div className="details">
        <Carousel media={animal.animalPictures} />
      </div>
    );
  }
}

export default Details;
