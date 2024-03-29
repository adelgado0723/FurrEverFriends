import React from 'react';

class Carousel extends React.Component {
  constructor(props) {
    super(props);

    const media = props.media;
    let photos = [];
    if (media && media[0]) {
      photos = media
        .map((mediaItem, index) => {
          if (index < 6) {
            return {
              small: mediaItem.small.url,
              large: mediaItem.large.url,
            };
          } else {
            return null;
          }
        })
        .filter((item) => {
          if (item) {
            return item;
          }
        });
    }
    this.state = {
      active: 0,
      photos,
    };
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
          <img
            src={
              photos[active] && photos[active].large ? photos[active].large : ''
            }
            alt="animal"
          />
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
