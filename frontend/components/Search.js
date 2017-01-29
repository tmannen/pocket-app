import React, { Component } from 'react';
import '../src/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import _ from 'lodash';

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {data: [], searchInput: ''};
        this.handleChange = this.handleChange.bind(this);
        this.searchTags = this.searchTags.bind(this);
    }

    componentDidMount() {
        this.searchTags();
    }

    handleChange(event) {
        this.setState({searchInput: event.target.value});
    }

    searchTags() {
        return $.getJSON('http://127.0.0.1:5000/search?q='+this.state.searchInput)
            .then((tags) => {
                this.setState({ data: tags });
            });
    }

    render() {

        return (
            <div className="container">
                {_.map(this.data, function(object, i){
                    return <span className="tag-label" key={i}>{object}</span>
                })}
            </div>
        );
    }
}

export default Search;
