import React from 'react';

const DetailsModalContent = (props) => (
  <React.Fragment>
    <h1>
      {props.name}
      's Details
    </h1>
    {props.detailsArray}
    <div className="buttons">
      <button onClick={props.toggleModal}>Close</button>
    </div>
  </React.Fragment>
);

export default DetailsModalContent;
