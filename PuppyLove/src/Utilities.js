require('dotenv').config();

const API_URL = 'https://api.rescuegroups.org/http/v2.json';

// Fetch Address data given a zip code
//*************************************************************************** */
function createLocationObj(animal) {
  return new Promise((resolve, reject) => {

    //Get City and State from google
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + animal.animalLocation + '&key=' + process.env.GOOGLE_API_KEY)
      .then(response => {
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
// getCoordinates(33012);
//*************************************************************************** */

// UTILITIES
//*************************************************************************** */
// Gets JSON from a link
function getJSON(url, callback, ...args) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response, ...args);
    } else {
      callback(status, xhr.response, ...args);
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
    return processingPromise;

  }).then((processedResponse) => {

    let animals;
    let promises = [];
    if (processedResponse && processedResponse.data) {

      animals = processedResponse.data

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
          }

        });
        promises.push(locationPromise);
      }

    }
    else {
      animals = {}
    }

    Promise.all(promises).then((values) => {
      this.setState({
        animals,
        loading: false,
      }).catch(err => this.setState({ error:err }));
    });
    return animals;

  });
}

exports.fetchAnimals = fetchAnimals;
exports.getJSON = getJSON;
exports.createLocationObj = createLocationObj;