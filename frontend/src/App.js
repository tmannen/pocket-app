import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import mockdata from '../mocks/tags.json';
import _ from 'lodash';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {data: mockdata, searchInput: ''};
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.tagList();
    }

    handleChange(event) {
        this.setState({searchInput: event.target.value});
    }

    filterData(){
        let myState = this.state;
        return _.filter(myState.data.tags, function(o){
            return o.indexOf(myState.searchInput)>-1;
        });
    }

    tagList() {
        /*return $.getJSON('https://randomuser.me/api/')
            .then((data) => {
                this.setState({ person: data.results });
            });*/
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
                <button className="btn btn-default" type="button">Go!</button>
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
