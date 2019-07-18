require('dotenv').config();
const API_URL = 'https://api.rescuegroups.org/http/v2.json';

function getUtilities() {
  const utilities = {
    fetchAnimals,
    fetchSpecies,
    fetchBreeds,
  };

  return utilities;

  // Fetch Address data given a zip code
  //************************************************************************ */
  function createLocationObj(animal) {
    return new Promise((resolve, reject) => {
      //Get City and State from google
      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          animal.animalLocation +
          '&key=' +
          process.env.GOOGLE_API_KEY
      ).then((response) => {
        getJSON(response.url, (err, data) => {
          if (err !== null) {
            reject(err);
          } else {
            // console.log(data.results[1])
            resolve(data.results[0]);
          }
        });
      });
    });
  }
  //************************************************************************ */

  // Gets JSON from a link
  //************************************************************************ */
  function getJSON(url, callback, ...args) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response, ...args);
      } else {
        callback(status, xhr.response, ...args);
      }
    };
    xhr.send();
  }
  //************************************************************************ */

  // Async publicSearch request
  // - Optional parameters allow for search customization.
  // - Defaults to returning the first 10 animals availabe for adoption
  //   sorted by animalID.
  //************************************************************************ */
  function fetchAnimals(params = [], fields = [], startingAnimal = '0') {
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
    fetch(API_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'text/json',
        Accept: 'text/json',
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
            const locationPromise = createLocationObj(animals[key]);
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
          });
        });
        return animals;
      });
  }

  //*************************************************************************** */
  // Get list of available species
  // TODO: make only retrieve available animal species
  //*************************************************************************** */
  function fetchSpecies() {
    const speciesQueryConnection = {
      apikey: process.env.API_KEY,
      objectType: 'animalSpecies',
      objectAction: 'publicList',
    };

    const listSpeciesPromise = fetch(API_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'text/json',
        Accept: 'text/json',
      },
      body: JSON.stringify(speciesQueryConnection),
    });
    const listSpeciesJSON = listSpeciesPromise.then((response) => {
      const processingPromise = response.json();
      // console.log(`In Processing: ${processingPromise}`);
      return processingPromise;
    });
    listSpeciesJSON.then((processedResponse) => {
      // Second then is to wait on the JSON parsing
      let species = [];
      if (processedResponse && processedResponse.data) {
        for (let key in processedResponse.data) {
          species.push(key);
        }
      }

      this.setState({
        species,
        // loading: false,
      });

      // console.table(species);
    });
  }
  //*************************************************************************** */

  // TODO: make only retrieve available animal breeds
  //*************************************************************************** */
  function fetchBreeds(species = '') {
    // const species = 'Dog';
    if (!species) {
      species = this.state.selectedSpecies;
    }
    const breedQueryParams = [
      {
        fieldName: 'breedSpecies',
        operation: 'equals',
        criteria: species,
      },
    ];

    const breedQueryConnection = {
      apikey: process.env.API_KEY,
      objectType: 'animalBreeds',
      objectAction: 'publicSearch',
      search: {
        resultStart: '0',
        resultLimit: '10',
        resultSort: 'breedName',
        resultOrder: 'asc',
        calcFoundRows: 'Yes',
        filters: breedQueryParams,
        fields: ['breedName'],
      },
    };

    const listBreedsPromise = fetch(API_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'text/json',
        Accept: 'text/json',
      },
      body: JSON.stringify(breedQueryConnection),
    });
    const listBreedsJSON = listBreedsPromise.then((response) => {
      const processingPromise = response.json();
      // console.log(`In Processing: ${processingPromise}`);
      return processingPromise;
    });
    listBreedsJSON.then((processedResponse) => {
      let breeds = [];
      // console.log(processedResponse);
      if (processedResponse && processedResponse.data) {
        for (let key in processedResponse.data) {
          if (species !== processedResponse.data[key].breedName) {
            breeds.push(processedResponse.data[key].breedName);
          }
        }
      }
      this.setState({
        breeds,
      });
    });
  }
  //*************************************************************************** */
}
export default getUtilities;
