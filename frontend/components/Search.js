import React, { Component } from 'react';
import '../src/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import _ from 'lodash';

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {data: {}, searchInput: this.props.location.query};
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
        console.log(this.state.searchInput)
        return $.getJSON('http://127.0.0.1:5000/search?q='+this.state.searchInput.q)
            .then((data) => {
                console.log(data)
                this.setState({ data: data });
            });
    }

    render() {

        return (
            <div className="container">
                {_.map(this.state.data.results, function(object, i){
                    return <span className="tag-label" key={i}>{object}</span>
                })}
            </div>
        );
    }
}

export default Search;
