import React, { Component } from 'react';
import '../src/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import _ from 'lodash';
import SearchBar from 'SearchBar'

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {data: {}, searchInput: this.props.location.query};
        this.queryServer = this.queryServer.bind(this);
    }

    componentDidMount() {
        this.queryServer();
    }

    queryServer() {
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
                <SearchBar/>

                {_.map(this.state.data.results, function(object, i){
                    return <span className="tag-label" key={i}>{object}</span>
                })}
            </div>
        );
    }
}

export default Search;
