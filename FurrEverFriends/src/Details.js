import React from 'react';
import Carousel from './Carousel.js';
import AnimalMap from './AnimalMap.js';
import Modal from './Modal.js';

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class Details extends React.Component {
  state = { showModal: false };

  toggleModal = () => this.setState({ showModal: !this.state.showModal });
  render() {
    const jsxDescription = htmlToReactParser.parse(
      this.props.location.state.description
    );
    const showModal = this.state.showModal;

    const details = (
      <table>
        <tr>
          <th>Name:</th>
          <td>{this.props.location.state.name}</td>
          <th>Species:</th>
          <td>{this.props.location.state.species}</td>
        </tr>
        <tr>
          <th>breed:</th>
          <td>{this.props.location.state.breed}</td>
          <th>location:</th>
          <td>{this.props.location.state.location.formattedAddress}</td>
        </tr>
        {/* Do the for loop here revealing the rest of the details */}
        {/* <tr>
          <th>header:</th>
          <td>item</td>
          <th>header:</th>
          <td>item</td>
        </tr>
        <tr>
          <th>header:</th>
          <td>item</td>
          <th>header:</th>
          <td>item</td>
        </tr> */}
      </table>
    );
    return (
      <div className="details">
        <h1>{this.props.location.state.name}</h1>
        <Carousel media={this.props.location.state.media} />
        <AnimalMap location={this.props.location.state.location} />
        <button onClick={this.toggleModal}>View Details</button>
        <div className="description">{jsxDescription}</div>
        {showModal ? (
          <Modal>
            <h1>{this.props.location.state.name}'s Details</h1>

            <div className="buttons">
              <button onClick={this.toggleModal}>Close</button>
              {/* <button onClick={this.toggleModal}>No</button> */}
            </div>
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default Details;
