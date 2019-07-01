require('dotenv').config();
const API_URL = 'https://api.rescuegroups.org/http/v2.json';

const search_params = [
  [
    fieldName: 'animalStatus',
    operation: 'equal',
    criteria: 'Available',
  ],
];
const connection = {
  apikey: process.env.API_KEY,
  objectType: 'animalBreeds',
  objectAction: 'publicSearch',
  test: '',
  search: [
      resultStart: 0,
      resultLimit: 10,
      resultSort: 'animalID',
      resultOrder: 'asc',
      calcFoundRows: 'Yes',
      filters: search_params,
      fields: ['animalID', 'animalOrgID', 'animalName', 'animalBreed'],
   
  ],
};

const promise = fetch(API_URL, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: process.env.API_KEY,
  },
  body: JSON.stringify(connection),
})
  .then((response) => {
    const processingPromise = response.json();
    console.log(`In Processing: ${processingPromise}`);
    return processingPromise;
  })
  .then((processedResponse) => {
    // Second then is to wait on the JSON parsing
    console.log(`All available animals: ${JSON.stringify(processedResponse)}`);
  });
