import Loadable from 'react-loadable';
import React from 'react';
import getUtilities from './Utilities.js';

const utils = getUtilities();

const LoadableModal = Loadable({
  loader: () => import('./Modal'),
  loading() {
    return <img className="spinner" alt="" width="200px" height="200px" />;
  },
});
const LoadableCarousel = Loadable({
  loader: () => import('./Carousel'),
  loading() {
    return <img className="spinner" alt="" width="200px" height="200px" />;
  },
});
const LoadableAnimalMap = Loadable({
  loader: () => import('./AnimalMap'),
  loading() {
    return <img className="spinner" alt="" width="200px" height="200px" />;
  },
});
const LoadableContent = Loadable({
  loader: () => import('./DetailsModalContent'),
  loading() {
    return <img className="spinner" alt="" width="200px" height="200px" />;
  },
});

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
  componentDidMount() {
    window.scrollTo(0, 0);
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
        <LoadableCarousel media={media} />
        <LoadableAnimalMap location={location} />
        <button onClick={this.toggleModal}>More Details</button>
        <div
          className="description"
          dangerouslySetInnerHTML={{
            __html: this.state.description,
          }}
        ></div>
        {showModal ? (
          <LoadableModal key={`${id}-Modal`}>
            <LoadableContent
              toggleModal={this.toggleModal}
              name={name}
              detailsArray={detailsArray}
            />
          </LoadableModal>
        ) : null}
      </div>
    );
  }
}

export default Details;
