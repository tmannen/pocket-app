import React, { Component } from 'react';
import '../src/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import _ from 'lodash';
import { router, browserHistory } from 'react-router'
import TagsInput from 'react-tagsinput'
import AutoSuggest from 'AutoSuggest';
import 'react-tagsinput/react-tagsinput.css'

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {data: [], searchInput: '', tagInputs: [], currentValue: ''};
        this.handleChange = this.handleChange.bind(this);
        this.searchTags = this.searchTags.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addToTags = this.addToTags.bind(this);
    }

    handleChange(event) {
        this.setState({searchInput: event.target.value});
    }

    handleTagChange(tags){
        this.setState({tagInputs: tags});
    }

    handleInputChange(value){
        this.setState({currentValue: value});
    }

    addToTags(tag){
        let newTags = this.state.tagInputs.slice();
        newTags.push(tag);
        this.setState({tagInputs: newTags});
        this.setState({currentValue: ''})
    }

    searchTags() {
        browserHistory.push({
            pathname: 'search',
            query: { q: this.state.tagInputs.join(",")}
        });
    }

    render() {

        return (
                <div className="row">
                    <form className="form-container">
                        <div className="col-lg-6 col-lg-offset-3">
                            <div className="input-group">
                                <TagsInput id="tagsinput-tk" value={this.state.tagInputs} inputValue={this.state.currentValue} onChangeInput={this.handleInputChange} onChange={this.handleTagChange} />
                                <span className="input-group-btn">
                                    <button className="btn btn-default" type="button" onClick={this.searchTags} >Go!</button>
                                </span>
                            </div>
                            <AutoSuggest
                                data={this.state.data}
                                inputVal={this.state.currentValue}
                                keyInputsFromClass={"react-tagsinput-input"}
                                addToTags={this.addToTags}
                                searchTags={this.searchTags}
                            />
                        </div>
                    </form>
                </div>
        );
    }
}

export default SearchBar;
