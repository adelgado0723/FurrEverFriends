import React from 'react';
import Carousel from './Carousel.js';
import AnimalMap from './AnimalMap.js';
import Modal from './Modal.js';
import getUtilities from './Utilities.js';

const utils = getUtilities();

class Details extends React.Component {
  constructor(props) {
    super(props);

    let description = '';
    description = props.location.state.description;
    const descElement = document.createElement('div');
    descElement.innerHTML = description;

    // Recursive walk
    utils.walkDOM(descElement, utils.removeStyle);

    description = descElement.innerHTML;
    // console.log(`After Cleaning: ${description}`);
    this.state = { showModal: false, description };
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal });
  render() {
    const showModal = this.state.showModal;

    const optionalDetails = [];
    for (let detail in this.props.location.state.details) {
      const detailValue = this.props.location.state.details[detail];
      if (detailValue) {
        optionalDetails.push(
          <div
            key={`${this.props.location.state.id}-${detail}`}
            className="detail"
          >
            <span className="detail-header">
              {detail
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

    const details = (
      <div className="details-table">
        <div className="detail" key={`${this.props.location.state.id}-Name`}>
          <span className="detail-header">Name:</span>
          <span className="detail-value">{this.props.location.state.name}</span>
        </div>
        <div className="detail" key={`${this.props.location.state.id}-Species`}>
          <span className="detail-header">Species:</span>
          <span className="detail-value">
            {this.props.location.state.species}
          </span>
        </div>
        <div className="detail" key={`${this.props.location.state.id}-Breed`}>
          <span className="detail-header">Breed:</span>
          <span className="detail-value">
            {this.props.location.state.breed}
          </span>
        </div>
        <div
          className="detail"
          key={`${this.props.location.state.id}-Location`}
        >
          <span className="detail-header">Location:</span>
          <span className="detail-value">
            {this.props.location.state.location.formattedAddress}
          </span>
        </div>
        {optionalDetails}
      </div>
    );

    return (
      <div className="details">
        <h1>{this.props.location.state.name}</h1>
        <Carousel media={this.props.location.state.media} />
        <AnimalMap location={this.props.location.state.location} />
        <button onClick={this.toggleModal}>More Details</button>
        <div
          className="description"
          dangerouslySetInnerHTML={{
            __html: this.state.description,
          }}
        ></div>
        {showModal ? (
          <Modal key={`${this.props.location.state.id}-Modal`}>
            <h1>{this.props.location.state.name}'s Details</h1>
            {details}
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
