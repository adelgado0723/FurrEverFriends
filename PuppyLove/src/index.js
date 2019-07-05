require('dotenv').config();
const API_URL = 'https://api.rescuegroups.org/http/v2.json';

// Get a list of all animals available for adoption
// TODO: Given a Breed
//*************************************************************************** */

const searchAllAvailableParams = [
  {
    fieldName: 'animalStatus',
    operation: 'equal',
    criteria: 'Available',
  },
];

const searchAllAvailableConnection = {
  apikey: process.env.API_KEY,
  objectType: 'animals',
  objectAction: 'publicSearch',
  search: {
    resultStart: '0',
    resultLimit: '10',
    resultSort: 'animalID',
    resultOrder: 'asc',
    calcFoundRows: 'Yes',
    filters: searchAllAvailableParams,
    fields: [
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
    ],
  },
};

const searchAllAvailablePromise = fetch(API_URL, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify(searchAllAvailableConnection),
});
const searchAllAvailableJSON = searchAllAvailablePromise.then((response) => {
  const processingPromise = response.json();
  // console.log(`In Processing: ${processingPromise}`);
  return processingPromise;
});
searchAllAvailableJSON.then((processedResponse) => {
  // Second then is to wait on the JSON parsing
  for (var id in processedResponse.data) {
    // console.table(processedResponse.data[id]);
    // console.log(JSON.stringify(processedResponse.data[id]));
  }
});

//*************************************************************************** */

// Get a list of all breeds given a species
//*************************************************************************** */
const species = 'Dog';
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
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify(breedQueryConnection),
});
const listBreedsJSON = listBreedsPromise.then((response) => {
  const processingPromise = response.json();
  // console.log(`In Processing: ${processingPromise}`);
  return processingPromise;
});
listBreedsJSON.then((processedResponse) => {
  // Second then is to wait on the JSON parsing
  // console.log(`All Breeds of ${species}: ${JSON.stringify(processedResponse)}`);
});
//*************************************************************************** */

// Get list of available species
//*************************************************************************** */
const speciesQueryConnection = {
  apikey: process.env.API_KEY,
  objectType: 'animalSpecies',
  objectAction: 'publicList',
};

const listSpeciesPromise = fetch(API_URL, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
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
  // console.log(`All Species: ${JSON.stringify(processedResponse)}`);
});
//*************************************************************************** */

// Find a specific animal by ID
//*************************************************************************** */
function findAnimalByID() {
const animalID = 68766;
const findAnimalByIDParams = [
  {
    fieldName: 'animalID',
    operation: 'equal',
    criteria: animalID,
  },
];

const findAnimalByIDConnection = {
  apikey: process.env.API_KEY,
  objectType: 'animals',
  objectAction: 'publicSearch',
  search: {
    resultStart: '0',
    resultLimit: '10',
    resultSort: 'animalID',
    resultOrder: 'asc',
    calcFoundRows: 'Yes',
    filters: findAnimalByIDParams,
    fields: [
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
    ],
  },
};

const findAnimalByIDPromise = fetch(API_URL, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify(findAnimalByIDConnection),
});
const findAnimalByIDJSON = findAnimalByIDPromise.then((response) => {
  const processingPromise = response.json();
  // console.log(`In Processing: ${processingPromise}`);
  return processingPromise;
});
findAnimalByIDJSON.then((processedResponse) => {
  // Second then is to wait on the JSON parsing
  console.log(`Finding animal with ID=${animalID}: `);
  for (var id in processedResponse.data) {
    // console.table(processedResponse.data[id]);
    console.log(JSON.stringify(processedResponse.data[id]));
  }
});
}
//*************************************************************************** */


// Fetch Address data given a zip code
//*************************************************************************** */
function getCoordinates(zip){
  fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+zip+'&key='+process.env.GOOGLE_API_KEY)
    .then(response => {
      // console.log(response);
      // response.json(); 
      getJSON(response.url, function handleLocationResponse(err, data){
        if (err !== null) {
          console.error('Something went wrong: ' + err);
        } else {
          // console.log('Your query count: ' + data.query.count);
          console.log(data.results[0]);
          console.log(data.results[0].formatted_address);
          const lat = data.results[0].geometry.location.lat;
          const long= data.results[0].geometry.location.lng;
          console.log(lat, long);
        }
      });

    });
  
}
getCoordinates(33012);
//*************************************************************************** */

// UTILITIES
//*************************************************************************** */
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
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
