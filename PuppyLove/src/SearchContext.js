import React from 'react';

const SearchContext = React.createContext({
  location: '',
  selectedSpecies: '',
  breed: '',
  breeds: [],
  fetchAllSpecies() {},
  fetchBreedsBySpecies() {},
  handleSpeciesChange() {},
  handleBreedChange() {},
  handleLocationChange() {},
});

export const Provider = SearchContext.Provider;
export const Consumer = SearchContext.Consumer;
