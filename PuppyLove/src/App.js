import React from "react";
import ReactDOM from "react-dom";
import Animal from "./Animal.js";
require('dotenv').config();


const API_URL = 'https://api.rescuegroups.org/http/v2.json';

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
    // Second then is to wait on the JSON parsing
    // for (var id in processedResponse.data) {
    // console.table(processedResponse.data[id]);
    // console.log(JSON.stringify(processedResponse.data[id]));
    // }
    let animals;
    if (processedResponse && processedResponse.data) {

      animals = processedResponse.data

    }
    else { animals = {} }

    this.setState({
      animals
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
    fetchAllAnimals();
  }

  render() {
    const fetchedAnimals = [];

    for (let id in this.state.animals) {
      const animal = this.state.animals[id];
      fetchedAnimals.push(
        <Animal name={animal.animalName} species={animal.animalSpecies} breed={animal.animalBreed} media={animal.animalPictures} location={animal.animalLocation} />
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
