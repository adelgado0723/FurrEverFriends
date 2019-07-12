require('dotenv').config();

function getUtilities() {
  const API_URL = 'https://api.rescuegroups.org/http/v2.json';
  const utilities = {
    fetchAnimals,
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
        resultStart: startingAnimal,
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
    })
      .then((response) => {
        const processingPromise = response.json();
        return processingPromise;
      })
      .then((processedResponse) => {
        console.log(processedResponse);
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
  }
}
export default getUtilities;
