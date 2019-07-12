import React from 'react';

class Search extends React.Component {
  state = {
    location: {},
    species: '',
    breed: '',
  };
  render() {
    return (
      <div className="search-params">
        <label htmlFor="location">
          location
          <input
            id="location"
            value={this.state.location.formattedAddress}
            placeholder="Location"
          />
        </label>
      </div>
    );
  }
}
