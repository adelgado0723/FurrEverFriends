import React from 'react';
import { navigate } from '@reach/router';
import Loadable from 'react-loadable';

const spinner = <img className="spinner" alt="" width="200px" height="200px" />;

const LoadableSearchBox = Loadable({
  loader: () => import('./SearchBox'),
  loading() {
    return spinner;
  },
});

class Search extends React.Component {
  search() {
    navigate('/');
  }
  render() {
    return (
      <div className="search-route">
        <LoadableSearchBox search={this.search} />
      </div>
    );
  }
}

export default Search;
