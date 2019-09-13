import React from 'react';
import Carousel from './Carousel.js';
import AnimalMap from './AnimalMap.js';
import Modal from './Modal.js';
import getUtilities from './Utilities.js';

const utils = getUtilities();

class Details extends React.Component {
  constructor(props) {
    super(props);
    const locationState =
      props.location && props.location.state ? props.location.state : '';

    // Cleaning HTML description from API
    let description = locationState ? locationState.description : '';
    if (description) {
      const descElement = document.createElement('div');
      descElement.innerHTML = description;

      // Recursive walk
      utils.walkDOM(descElement, utils.removeStyle);
      description = descElement.innerHTML;
    }
    this.state = { showModal: false, description, locationState };
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal });
  render() {
    const showModal = this.state.showModal;

    const {
      name,
      id,
      details,
      species,
      breed,
      location,
      media,
    } = this.state.locationState;

    const optionalDetails = [];
    for (let detail in details) {
      const detailValue = details[detail];
      if (detailValue) {
        optionalDetails.push(
          <div key={`${id}-${detail}`} className="detail">
            <span className="detail-header">
              {// capitalizing the first letter of each detail header}
              detail
                .toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')}
              :
            </span>
            <span className="detail-value">{detailValue}</span>
          </div>
        );
      }
    }
    // Adding an extra empty detail for table-like appearance
    if (optionalDetails.length % 2 != 0) {
      optionalDetails.push(
        <div key={`rounding off detail`} className="detail">
          <span className="detail-header"></span>
          <span className="detail-value"></span>
        </div>
      );
    }

    const detailsArray = (
      <div className="details-table">
        <div className="detail" key={`${id}-Name`}>
          <span className="detail-header">Name:</span>
          <span className="detail-value">{name}</span>
        </div>
        <div className="detail" key={`${id}-Species`}>
          <span className="detail-header">Species:</span>
          <span className="detail-value">{species}</span>
        </div>
        <div className="detail" key={`${id}-Breed`}>
          <span className="detail-header">Breed:</span>
          <span className="detail-value">{breed}</span>
        </div>
        <div className="detail" key={`${id}-Location`}>
          <span className="detail-header">Location:</span>
          <span className="detail-value">
            {location && location.formattedAddress
              ? location.formattedAddress
              : ''}
          </span>
        </div>
        {optionalDetails}
      </div>
    );

    return (
      <div className="details">
        <h1>{name}</h1>
        <Carousel media={media} />
        <AnimalMap location={location} />
        <button onClick={this.toggleModal}>More Details</button>
        <div
          className="description"
          dangerouslySetInnerHTML={{
            __html: this.state.description,
          }}
        ></div>
        {showModal ? (
          <Modal key={`${id}-Modal`}>
            <h1>
              {name}
              's Details
            </h1>
            {detailsArray}
            <div className="buttons">
              <button onClick={this.toggleModal}>Close</button>
            </div>
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default Details;
