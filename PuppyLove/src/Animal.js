import React from "react";

class Animal extends React.Component {
  render() {
    const { name, species, breed, media, location } = this.props;
    let thumbnail = {};
    if (media && media[0] && media[0].urlSecureThumbnail) {
      thumbnail = media[0].urlSecureThumbnail;
    }

    return (
      <div className="animal" >
        <div className="image-container">
          <img src={thumbnail} alt={name} />
        </div>
        <div className="info">
          <h1>{name}</h1>
          <h2>{`${species} - ${breed} - ${location}`}</h2>
        </div>
      </div>
    );

  }
}

export default Animal;