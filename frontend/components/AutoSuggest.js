import React, { Component } from 'react';
import '../src/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import _ from 'lodash';

class AutoSuggest extends Component {

    constructor(props) {
        super(props);
        this.state = {data: [], inputVal: '', navigation: 0};
        this.handleKeys = this.handleKeys.bind(this);
    }

    componentDidMount() {
        let input = document.getElementsByClassName(this.props.keyInputsFromClass)[0];
        input.addEventListener("keydown", this.handleKeys);
    }

    handleKeys(event) {
        if (event.key==='Enter' && document.getElementsByClassName('tk-autosuggest-tag selected')){
            event.preventDefault();
            let tag = document.getElementsByClassName('tk-autosuggest-tag selected')[0].innerText;
            this.handleEnter(tag);
        }
        if (event.key==='ArrowDown' || event.key==='ArrowUp')
            this.navigateWithKeys(event.key);
    }

    handleEnter(tag) {
        console.log(tag)
        this.props.addToTags(tag)
    }

    navigateWithKeys(key) {
        if (key==='ArrowUp'  && this.state.navigation>=0)
            this.state.navigation--;
        if (key==='ArrowDown' && this.state.navigation<=this.filterData().length-1)
            this.state.navigation++;
        let self = this;
        let elements = document.getElementsByClassName('tk-autosuggest-tag');
        _.forEach(elements,function(object, i){
            object.className="tk-autosuggest-tag";
            if (self.state.navigation==i+1)
                object.className+=" selected";
        });

    }

    componentWillReceiveProps(nextProps) {
        this.setState({data: nextProps.data, inputVal: nextProps.inputVal});
    }

    componentWillUpdate(){

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
            <div className="tk-autosuggest">
                {_.map(this.filterData(), function(object, i){
                    return <div className="tk-autosuggest-tag" key={i}>{object}</div>
                })}
            </div>
        );
    }
}

export default AutoSuggest;