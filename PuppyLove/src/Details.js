import React from "react";
import Carousel from "./Carousel.js";
let utils = require('./Utilities');


class Details extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {loading: true};
  }
  componentDidMount() {
    const params = [{
      fieldName: 'animalID',
      operation: 'equal',
      criteria: this.props.id,
    }, ];
    
    const fetchByID = utils.fetchAnimals.bind(this);
    fetchByID(params);
  }
  render() {
    if(this.state.loading){
      return <h1>LOADING...</h1>
    }
    const animal = this.state.animals[this.props.id];
    console.log(animal);
    return <h1>Hi {this.props.id}!</h1>;
  }
}

export default Details;

