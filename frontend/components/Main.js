import React, { Component } from 'react';
import '../src/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import _ from 'lodash';
import { router, browserHistory } from 'react-router'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {data: [], searchInput: '', tagInputs: []};
        this.handleChange = this.handleChange.bind(this);
        this.searchTags = this.searchTags.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
    }

    componentDidMount() {
        this.tagList();
    }

    handleChange(event) {
        this.setState({searchInput: event.target.value});
        console.log(event.target.value)
    }
    handleTagChange(tags){
        this.setState({tagInputs: tags});
    }

    filterData(){
        let myState = this.state;
        return _.filter(myState.data, function(o){
            return o.indexOf(myState.searchInput)>-1;
        });
    }

    tagList() {
        return $.getJSON('http://127.0.0.1:5000/tags')
            .then((data) => {
                this.setState({ data: data.tags });
            });
    }

    searchTags() {
        browserHistory.push({
            pathname: 'search',
            query: { q: this.state.tagInputs.join(",")}
        });
    }

    render() {

        return (
            <div className="container">
                <div className="row">
                    <form className="form-container">
                        <div className="col-lg-6 col-lg-offset-3">
                            <div className="input-group">
                                <TagsInput value={this.state.tagInputs} onChange={this.handleTagChange} />
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

export default Main;
