import React, { Component } from 'react';
import '../src/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import _ from 'lodash';
import { router, browserHistory } from 'react-router'
import moment from 'moment';
import SearchBar from 'SearchBar'

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {data: {}, query: this.props.location.query.q};
        this.queryServer = this.queryServer.bind(this);
        this.queryServerWithTag = this.queryServerWithTag.bind(this);
    }

    componentDidMount() {
        this.queryServer(this.props.location.query.q);
    }

    componentWillReceiveProps(nextProps) {
        this.queryServer(nextProps.location.query.q);
        window.scrollTo(0, 0); //scrolls to top after refresh
    }

    queryServer(query) {
        return $.getJSON('http://127.0.0.1:5000/search?q='+query)
            .then((data) => {
                this.setState({ data: data });
            });
    }

    queryServerWithTag(tag) {
        //used when clicking a tag, this makes it so componentWillReceiveProps is called (?) and it queries the database
        browserHistory.push({
            pathname: 'search',
            query: { q: tag}
        });
    }

    render() { 
        var self = this;
        return (
            <div className="container">
                <SearchBar tags={this.props.location.query.q} />
                <div className="col-sm-12 thumbnail-container">
                    {_.map(_.orderBy(this.state.data.results, 'time_added', 'desc'), function(object, i){
                        return <div className="col-sm-3" key={i}>
                                    <div className="thumbnail">
                                        <div className="caption">
                                            <h3><a href={object.resolved_url}>{object.resolved_title === "" ? object.resolved_url : object.resolved_title} 
                                            <p className="link_url">({object.resolved_url})</p></a></h3>
                                            <p>{object.excerpt}</p>
                                        </div>
                                        <div className="icon-holder">
                                            <div className="glyphicon glyphicon-tags search-tag"></div>
                                            {_.map(Object.keys(object.tags), function(tag, index){
                                                return <div className="object-tag" key={index} onClick={self.queryServerWithTag.bind(self, tag)}>{tag}</div>;
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
