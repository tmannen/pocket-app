import React, { Component } from 'react';
import '../src/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import _ from 'lodash';
import { router, browserHistory } from 'react-router'
import TagsInput from 'react-tagsinput'
import AutoSuggest from 'AutoSuggest';
import SearchBar from 'SearchBar'
import 'react-tagsinput/react-tagsinput.css'

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {data: [], searchInput: ''};
    }

    componentDidMount() {
        this.tagList();
    }

    filterData(){
        let myState = this.state;
        return _.filter(myState.data, function(o){
            return o.indexOf(myState.searchInput)>-1; //mitä tää siis tekee tässä?
       });
    }

    tagList() {
        return $.getJSON('http://127.0.0.1:5000/tags')
            .then((data) => {
                this.setState({ data: data.tags });
            });
    }

    render() {

        return (
            <div className="container">
                <SearchBar/>
                <div className="row tag-container">
                    {_.map(this.filterData(), function(object, i){
                        return <span className="tag-label" key={i}>{object}</span>
                    })}
                </div>
            </div>
        );
    }
}

export default Main;
