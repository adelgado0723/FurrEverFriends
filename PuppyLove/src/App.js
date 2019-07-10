import React from "react";
import ReactDOM from "react-dom";
import Animal from "./Animal.js";
require('dotenv').config();


const API_URL = 'https://api.rescuegroups.org/http/v2.json';

// Fetch Address data given a zip code
//*************************************************************************** */
// TODO: This funtion is strying to access state immediately after it is set. This is not working!
function createLocationObj() {
  //Get City and State from google
  for (let key in this.state.animals) {
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.animals[key].animalLocation + '&key=' + process.env.GOOGLE_API_KEY)
      .then(response => {
        getJSON(response.url, handleLocationResponse);

      });
  }
  const handleLocationResponse = (err, data) => {
    if (err !== null) {
      console.error('Something went wrong: ' + err);
    } else {
      // console.log(response);
      this.setState((prevState) => {
        let animals = Object.assign({}, prevState.animals);
        animals[key].animalLocation = data.results[0].formatted_address;
        // TODO: Retrieve and store coordinates here
        return { animals };

      });
    }
  }
}
// getCoordinates(33012);
//*************************************************************************** */

// UTILITIES
//*************************************************************************** */
// Gets JSON from a link
const getJSON = function xhrRequest(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};
//*************************************************************************** */

function fetchAnimals(params = [], fields = []) {

  if (params.length === 0) {
    params = [
      {
        fieldName: 'animalStatus',
        operation: 'equal',
        criteria: 'Available',
      },
    ];
  }

  if (fields.length === 0) {
    fields = [
      'animalID',
      'animalOrgID',
      'animalName',
      'animalBreed',
      'animalBirthdate',
      'animalBirthdateExact',
      'animalColor',
      'animalLocation',
      'animalSex',
      'animalSpecies',
      'animalSummary',
      'animalPictures',
      'animalVideos',
      'animalVideoUrls',
    ];

  }
  const searchConnection = {
    apikey: process.env.API_KEY,
    objectType: 'animals',
    objectAction: 'publicSearch',
    search: {
      resultStart: '0',
      resultLimit: '10',
      resultSort: 'animalID',
      resultOrder: 'asc',
      calcFoundRows: 'Yes',
      filters: params,
      fields: fields,
    },
  };

  fetch(API_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(searchConnection),
  }).then((response) => {
    const processingPromise = response.json();
    // console.log(`In Processing: ${processingPromise}`);
    return processingPromise;
  }).then((processedResponse) => {

    let animals;
    if (processedResponse && processedResponse.data) {

      animals = processedResponse.data

    }
    else { animals = {} }

    this.setState({
      animals
    }, () => {
      //TODO: Consider doing this before setting state.
      //Pass animal object?
      const fetchLocation = createLocationObj.bind(this);
      fetchLocation();

    });

  });

}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animals: []
    };
  }

  componentDidMount() {
    // Fetch all animals available for adoption
    const fetchAllAnimals = fetchAnimals.bind(this);

    // const fetchLocation = createLocationObj.bind(this);
    fetchAllAnimals();


  }

  render() {
    const fetchedAnimals = [];

    for (let id in this.state.animals) {
      const animal = this.state.animals[id];
      fetchedAnimals.push(
        <Animal name={animal.animalName} species={animal.animalSpecies} breed={animal.animalBreed} media={animal.animalPictures} location={animal.animalLocation} key={animal.animalID} />
      );
    }
    return (
      <div>
        <h1>Puppy Love Pet Adoption</h1>
        {/* <pre>
          <code>{JSON.stringify(this.state, null, 2)}</code>
        </pre> */}
        {fetchedAnimals}
      </div>
    );

  }
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
