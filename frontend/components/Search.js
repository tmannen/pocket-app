import React, { Component } from 'react';
import '../src/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import SearchBar from 'SearchBar'

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {data: {}, query: this.props.location.query.q};
        this.queryServer.bind(this);
    }

    componentDidMount() {
        this.queryServer(this.props.location.query.q);
    }


    queryServer(query) {
        return $.getJSON('http://127.0.0.1:5000/search?q='+query)
            .then((data) => {
                this.setState({ data: data });
            });
    }

    render() {

        return (
            <div className="container">
                <SearchBar clickFunction={this.queryServer.bind(this)}/>
                <div className="col-sm-12 thumbnail-container">
                    {_.map(this.state.data.results, function(object, i){
                            return <div className="col-sm-3">
                                        <div className="thumbnail" key={i}>
                                            <div className="caption">
                                                <h3><a href={object.resolved_url}>{object.resolved_title}</a></h3>
                                                <p>{object.excerpt}</p>
                                            </div>
                                            <div className="icon-holder">
                                                <div className="glyphicon glyphicon-tags search-tag"></div>
                                                {_.map(object.tags, function(tag, index){
                                                    return <div className="object-tag">{index}</div>;
                                                })}
                                            </div>
                                            <div className="icon-holder-time">
                                                <div className="glyphicon glyphicon-time"></div>
                                                {moment.unix(object.time_added).format('DD.MM.YYYY')}
                                            </div>
                                        </div>
                                   </div>
                    })}
                </div>
            </div>
        );
    }
}

export default Search;
