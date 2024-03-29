require('dotenv').config();
const API_URL = 'https://api.rescuegroups.org/http/v2.json';

function getUtilities() {
  const utilities = {
    fetchAnimals,
    fetchSpecies,
    fetchBreeds,
    removeStyle,
    walkDOM,
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
  function fetchAnimals(startingAnimal = '0', resultLimit = '10') {
    //always looking for available animals
    this.setState({ loading: true }, retrieve);
    function retrieve() {
      let params = [];
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
          if (this.props.searchParams.radius) {
            params.push({
              fieldName: 'animalLocationDistance',
              operation: 'radius',
              criteria: this.props.searchParams.radius,
            });

            // console.log(`Location: ${this.props.searchParams.location}`);
            // console.log(`Radius: ${this.props.searchParams.radius}`);
          }
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
      const fields = [
        'animalBirthdate',
        'animalBreed',
        'animalColor',
        // 'animalDescriptionPlain',
        'animalDescription',
        'animalGeneralAge',
        'animalGeneralSizePotential',
        'animalHousetrained',
        'animalID',
        'animalLocation',
        'animalLocationCitystate',
        'animalLocationCoordinates',
        'animalLocationState',
        'animalName',
        'animalPictures',
        'animalPrimaryBreed',
        'animalSex',
        // 'animalSizeCurrent',
        'animalSpecies',
      ];
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
          // console.log(processedResponse);

          let animals;
          let numAnimals = 0;
          let numPages = 0;
          let pageNumber = 0;
          const startingAnimalIndex = parseInt(startingAnimal, 10);
          const resultLimitNumber = parseInt(resultLimit, 10);

          if (processedResponse && processedResponse.data) {
            numAnimals = processedResponse.foundRows;
            animals = processedResponse.data;
            numPages = Math.ceil(numAnimals / resultLimitNumber);
            pageNumber = Math.ceil(
              (startingAnimalIndex + 1) / resultLimitNumber
            );
            for (let key in animals) {
              const coords = animals[key].animalLocationCoordinates.split(',');
              animals[key].location = {
                zip: animals[key].animalLocation,
                state: animals[key].animalLocationState,
                longitude: coords[1],
                latitude: coords[0],
                formattedAddress: animals[key].animalLocationCitystate,
              };

              // console.table(animals[key].location);
            }
          } else {
            animals = {};
          }
          // console.log(numPages);
          this.setState({
            animals,
            loading: false,
            numAnimals,
            numPages,
            pageNumber,
            startingAnimalIndex,
            resultLimit: resultLimitNumber,
          });
        });
    }
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
        resultLimit: '400',
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

  //************************************************************************ */
  function defineObject(object = 'animals') {
    const searchConnection = {
      apikey: process.env.API_KEY,
      objectType: object,
      objectAction: 'define',
    };
    // console.table(params);
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
        // console.log(processedResponse);
      });
  }

  //*************************************************************************** */
  // remove_style looks to see if any of the attributes in the attr array are
  // present in the element parameter and removes them if found.
  //*************************************************************************** */
  // https://css-tricks.com/snippets/javascript/remove-inline-styles/
  function removeStyle(element) {
    // console.log(element);
    var j, is_hidden;

    // Presentational attributes.
    var attr = [
      'align',
      'autofocus',
      'background',
      'bgcolor',
      'border',
      'cellpadding',
      'cellspacing',
      'color',
      'face',
      'height',
      'hspace',
      'marginheight',
      'marginwidth',
      'noshade',
      'nowrap',
      'valign',
      'vspace',
      'width',
      'vlink',
      'alink',
      'text',
      'link',
      'frame',
      'frameborder',
      'clear',
      'scrolling',
      'style',
      'class',
    ];

    var attr_len = attr.length;
    if (element.nodeName !== '#text') {
      if (element.style) {
        is_hidden = element.style.display === 'none';
      }
      j = attr_len;

      while (j--) {
        if (element.removeAttribute) {
          element.removeAttribute(attr[j]);
        }
      }

      // Re-hide display:none elements,
      // so they can be toggled via JS.
      if (is_hidden) {
        element.style.display = 'none';
      }
    }
  }
  //*************************************************************************** */
  // from https://www.javascriptcookbook.com/article/traversing-dom-subtrees-with-a-recursive-walk-the-dom-function/
  // recursively visits each child node, applying the parameter, func, to each
  //*************************************************************************** */
  function walkDOM(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
      walkDOM(node, func);
      node = node.nextSibling;
    }
  }
  //*************************************************************************** */
}
export default getUtilities;
