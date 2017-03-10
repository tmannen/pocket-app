import React, { Component } from 'react';
import '../src/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import _ from 'lodash';
import $ from 'jquery';

class AutoSuggest extends Component {

    constructor(props) {
        super(props);
        this.state = {data: [], inputVal: '', navigation: 0};
        this.handleKeys = this.handleKeys.bind(this);
    }

    componentDidMount() {
        this.tagList();
        let input = document.getElementsByClassName(this.props.keyInputsFromClass)[0];
        input.addEventListener("keydown", this.handleKeys);
    }

    tagList() {
        return $.getJSON('http://127.0.0.1:5000/tags')
            .then((data) => {
                this.setState({ data: data.tags });
            });
    }

    handleKeys(event) {
        if (event.key==='Enter' && this.state.inputVal === '')
            this.props.searchTags();
        else if (event.key==='Enter'){
            event.preventDefault();
            if(document.getElementsByClassName('tk-autosuggest-tag selected')[0] === undefined)
                this.handleEnter(this.state.inputVal);
            else {
                let tag = document.getElementsByClassName('tk-autosuggest-tag selected')[0].innerText;
                this.handleEnter(tag);
            }
        }

        if (event.key==='ArrowDown' || event.key==='ArrowUp' || event.key==='Backspace')
            this.navigateWithKeys(event.key);

    }

    handleEnter(tag) {
        this.props.addToTags(tag)
        this.state.navigation = 0
    }

    navigateWithKeys(key) {
        if (key==='ArrowUp'  && this.state.navigation>=0)
            this.state.navigation--;
        if (key==='ArrowDown' && this.state.navigation<=this.filterData().length-1)
            this.state.navigation++;
        if (key==='Backspace')
            this.state.navigation = 0; //so that if we're at the third one for example and delete, we go back to start
        let self = this;
        let elements = document.getElementsByClassName('tk-autosuggest-tag');
        _.forEach(elements,function(object, i){
            object.className="tk-autosuggest-tag";
            if (self.state.navigation==i+1)
                object.className+=" selected";
        });

    }

    componentWillReceiveProps(nextProps) {
        this.setState({inputVal: nextProps.inputVal});
    }

    handleChange(event) {
        this.setState({searchInput: event.target.value});
    }

    filterData() {
        let inputVal = this.state.inputVal;
        return _.filter(this.state.data, function(o){
            return (o.indexOf(inputVal)>-1 && inputVal!='');
        });
    }

    render() {
        return (
            <div className="autosuggest-container">
                {_.map(this.filterData(), function(object, i){
                    return <div className="tk-autosuggest-tag" key={i}>{object}</div>
                })}
            </div>
        );
    }
}

export default AutoSuggest;
