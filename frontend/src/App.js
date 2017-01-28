import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import mockdata from '../mocks/tags.json';
import _ from 'lodash';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {data: [], searchInput: ''};
        this.handleChange = this.handleChange.bind(this);
        this.searchTags = this.searchTags.bind(this);
    }

    componentDidMount() {
        this.tagList();
    }

    handleChange(event) {
        this.setState({searchInput: event.target.value});
    }

    filterData(){
        let myState = this.state;
        return _.filter(myState.data, function(o){
            return o.indexOf(myState.searchInput)>-1;
        });
    }

    tagList() {
        return $.getJSON('http://127.0.0.1:5000/tags')
            .then((tags) => {
                this.setState({ data: tags });
            });
    }

    searchTags() {
        return $.getJSON('http://127.0.0.1:5000/search?q='+this.state.searchInput)
            .then((tags) => {
            console.log(tags)
                this.setState({ data: tags });
            });
    }

  render() {

    return (
      <div className="container">
        <div className="row">
          <form className="form-container">
            <div className="col-lg-6 col-lg-offset-3">
              <div className="input-group">
                <input type="text" value={this.state.searchInput} onChange={this.handleChange} className="form-control" placeholder="Search for..."/>
                <span className="input-group-btn">
                <button className="btn btn-default" type="button" onClick={this.searchTags} >Go!</button>
              </span>
              </div>
            </div>
          </form>
        </div>
          <div className="row tag-container">
              {_.map(this.filterData(), function(object, i){
                  return <span className="tag-label" key={i}>{object}</span>
              })}
          </div>
      </div>
    );
  }
}

export default App;
