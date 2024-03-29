import React from 'react';

const SearchContext = React.createContext({
  // loading: '',
  location: '',
  selectedSpecies: '',
  breed: '',
  breeds: [],
  radius: '',
  handleRadiusChange() {},
  fetchAllSpecies() {},
  fetchBreedsBySpecies() {},
  handleSpeciesChange() {},
  handleBreedChange() {},
  handleLocationChange() {},
});

export const Provider = SearchContext.Provider;
export const Consumer = SearchContext.Consumer;
