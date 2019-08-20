import React from 'react';

class Carousel extends React.Component {
  state = {
    photos: [],
    active: 0,
  };
  // This function gives us an opportunity to
  // perform transformations and set the state
  // given the passed in props.
  static getDerivedStateFromProps({ media }) {
    let photos = [];
    if (media && media[0]) {
      photos = media.map((mediaItem) => {
        return {
          small: mediaItem.small.url,
          large: mediaItem.large.url,
        };
      });
      return { photos };
    }
  }
  handleIndexClick = (event) => {
    this.setState({
      // The "+" here is for converting the
      // data-index into a number
      active: +event.target.dataset.index,
    });
  };
  render() {
    const { photos, active } = this.state;
    return (
      <div className="carousel">
        <div className="active-img-container">
          <img src={photos[active].large} alt="animal" />
        </div>
        <div className="carousel-smaller">
          {photos.map((photo, index) => (
            <img
              onClick={this.handleIndexClick}
              data-index={index}
              src={photo.small}
              key={photo.small}
              className={index === active ? 'active' : ''}
              alt="animal-thumbnail"
            />
          ))}
        </div>
      </div>
    );
  }
}
export default Carousel;
