import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Loadable from 'react-loadable';
import { Router, Link } from '@reach/router';
import { Provider } from './SearchContext';
import getUtilities from './Utilities';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const utils = getUtilities();

const spinner = <img className="spinner" alt="" width="200px" height="200px" />;

// Loading components independently
const LoadableDetails = Loadable({
  loader: () => import('./Details'),
  loading() {
    return spinner;
  },
});
const LoadableResults = Loadable({
  loader: () => import('./Results'),
  loading() {
    return spinner;
  },
});
const LoadableSearchParams = Loadable({
  loader: () => import('./SearchParams'),
  loading() {
    return spinner;
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      selectedSpecies: '',
      species: [],
      breeds: [],
      breed: '',
      radius: '',
      handleRadiusChange: this.handleRadiusChange,
      fetchAllSpecies: this.fetchAllSpecies,
      fetchBreedsBySpecies: this.fetchBreedsBySpecies,
      handleSpeciesChange: this.handleSpeciesChange,
      handleBreedChange: this.handleBreedChange,
      handleLocationChange: this.handleLocationChange,
    };
  }
  fetchAllSpecies = utils.fetchSpecies.bind(this);
  fetchBreedsBySpecies = utils.fetchBreeds.bind(this);

  handleSpeciesChange = (event) => {
    this.setState(
      {
        selectedSpecies: event.target.value,
      },
      this.fetchBreedsBySpecies
    );
  };
  handleBreedChange = (event) => {
    this.setState({
      breed: event.target.value,
    });
  };

  handleRadiusChange = (event) => {
    this.setState({
      radius: event.target.value,
    });
  };

  handleLocationChange = (event) => {
    this.setState({
      location: event.target.value,
    });
  };
  componentDidMount() {
    // Fetching list of all species to populate select input
    this.fetchAllSpecies();
  }
  render() {
    return (
      <div className="app-root">
        <header>
          <Link to="/" className="title">
            <span className="title-first">FurrEver</span>{' '}
            <span className="title-first">Friends</span>
          </Link>
          <Link to="/search-params">
            <span aria-label="search" role="img" className="search-icon">
              🔍
            </span>
          </Link>
        </header>
        <Provider value={this.state}>
          <div className="site-wrap">
            <Router>
              <LoadableResults path="/" />
              <LoadableDetails path="details/:id" />
              <LoadableSearchParams path="/search-params" />
            </Router>
          </div>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
