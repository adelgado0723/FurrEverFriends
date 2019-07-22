import React from 'react';
import Carousel from './Carousel.js';
import AnimalMap from './AnimalMap.js';

class Details extends React.Component {
  render() {
    return (
      <div className="details">
        <h1>{this.props.location.state.name}</h1>
        <Carousel media={this.props.location.state.media} />
        <AnimalMap location={this.props.location.state.media} />
      </div>
    );
  }
}

export default Details;
