import React from 'react';
import { navigate } from '@reach/router';
import Loadable from 'react-loadable';

const LoadableSearchBox = Loadable({
  loader: () => import('./SearchBox'),
  loading() {
    return <h1>Loading split SearchBox code...</h1>;
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
