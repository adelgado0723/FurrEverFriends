import React from 'react';
import Animal from './Animal.js';
import getUtilities from './Utilities.js';
import SearchBox from './SearchBox.js';
import { Consumer } from './SearchContext.js';
// import { tsConstructSignatureDeclaration } from '@babel/types';

require('dotenv').config();
const utils = getUtilities();

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animals: [],
      loading: true,
    };
  }
  // TO get fetchAnimals function from context:
  // fetchAnimals = this.props.searchParams.fetchAnimals.bind(this);
  // fetchAnimals = utils.fetchAnimals.bind(this);

  fetchAnimals = (params = [], fields = [], startingAnimal = '0') => {
    //always looking for available animals

    params.push({
      fieldName: 'animalStatus',
      operation: 'equal',
      criteria: 'Available',
    });
    if (this.props.searchParams) {
      if (this.props.searchParams.location) {
        params.push({
          fieldName: 'animalLocation',
          operation: 'equal',
          criteria: this.props.searchParams.location,
        });
      }
      if (this.props.searchParams.selectedSpecies) {
        params.push({
          fieldName: 'animalSpecies',
          operation: 'equal',
          criteria: this.props.searchParams.selectedSpecies,
        });
        if (this.props.searchParams.breed) {
          params.push({
            fieldName: 'animalBreed',
            operation: 'equal',
            criteria: this.props.searchParams.breed,
          });
        }
      }
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
        resultStart: startingAnimal,
        resultLimit: '10',
        resultSort: 'animalID',
        resultOrder: 'asc',
        calcFoundRows: 'Yes',
        filters: params,
        fields: fields,
      },
    };

    // console.table(params);
    fetch(utils.API_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        // Accept: 'application/json',
      },
      body: JSON.stringify(searchConnection),
    })
      .then((response) => {
        const processingPromise = response.json();
        return processingPromise;
      })
      .then((processedResponse) => {
        // console.log(processedResponse);
        let animals;
        let promises = [];
        if (processedResponse && processedResponse.data) {
          animals = processedResponse.data;

          // Collecting array of promises for each location request
          for (let key in animals) {
            const locationPromise = utils.createLocationObj(animals[key]);
            locationPromise.then((location) => {
              animals[key].location = {
                zip: location.address_components[0],
                city: location.address_components[1],
                county: location.address_components[2],
                state: location.address_components[3],
                country: location.address_components[4],
                longitude: location.geometry.location.lng,
                latitude: location.geometry.location.lat,
                formattedAddress: location.formatted_address,
              };
            });
            promises.push(locationPromise);
          }
        } else {
          animals = {};
        }

        Promise.all(promises).then((values) => {
          this.setState({
            // TODO: Set number of rows returned and num pages that produces
            animals,
            loading: false,
          }).catch((err) =>
            this.setState({
              error: err,
            })
          );
        });
        return animals;
      });
  };
  componentDidMount() {
    this.fetchAnimals();
  }

  render() {
    if (this.state.loading) {
      return <h1> LOADING RESULTS... </h1>;
    }
    const fetchedAnimals = [];

    for (let id in this.state.animals) {
      const animal = this.state.animals[id];
      fetchedAnimals.push(
        <Animal
          name={animal.animalName}
          species={animal.animalSpecies}
          breed={animal.animalBreed}
          media={animal.animalPictures}
          location={animal.location}
          key={animal.animalID}
          id={animal.animalID}
        />
      );
    }
    return (
      <div className="search">
        {/* <pre>
          <code>{JSON.stringify(this.state, null, 2)}</code>
        </pre> */}
        <SearchBox search={this.fetchAnimals} />

        {fetchedAnimals}
      </div>
    );
  }
}
export default function ResultsWithContext(props) {
  return (
    <Consumer>
      {(context) => <Results {...props} searchParams={context} />}
    </Consumer>
  );
}
