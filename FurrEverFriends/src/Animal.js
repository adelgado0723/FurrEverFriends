import React from 'react';
import { Link } from '@reach/router';

class Animal extends React.Component {
  render() {
    const { name, species, breed, media, location, id } = this.props;
    let thumbnail = {};
    if (media && media[0] && media[0].urlSecureThumbnail) {
      thumbnail = media[0].large.url;
    }

    return (
      <Link to={`/details/${id}`} state={this.props} className="animal">
        <div className="image-container">
          <img src={thumbnail} alt={name} />
        </div>
        <h1>{name}</h1>
        <h2>{`${species} - ${breed} - ${
          location && location.formattedAddress ? location.formattedAddress : ''
        }`}</h2>
      </Link>
    );
  }
}

export default Animal;
