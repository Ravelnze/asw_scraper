import React, { Component } from 'react';
import AddonListing from './AddonListing.js';
import customAdditions from './customAdditions.json'

export default class AddonCollection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filtered: []
        }
        this.count = 0;
        this.incrementCounter = this.incrementCounter.bind(this)
    }

    componentWillMount() {
        fetch("https://s3-us-west-2.amazonaws.com/ambrosiaevn/" + this.props.url + "-site-data.json")
        .then( (response) => {
            return response.json();
        })
        .then( (siteData) => {
            var json = siteData;
            if(customAdditions[this.props.url].length > 0) {
                customAdditions[this.props.url].forEach(addon => {
                    json.push(addon);
                });
            }
            this.setState({
                data: json, 
                filtered: json
            });
        });
    }

    componentWillReceiveProps(newProps) {
        var temp = this.state.data;

        if (newProps.searchValue !== '') {
            temp = this.searchList(newProps.searchValue, temp);
        } else {
            temp = this.state.data;
        }

        if (newProps.category !== '') {
            temp = this.filterList(newProps.category, temp);
        }

        this.setState({
            filtered: temp
        })
    }

    filterList(category, list) {
        return list.filter((a) => {
            return a.category.toLowerCase() === category.toLowerCase();
        });
    }

    searchList(expression, list) {
        return list.filter((a) => {
            return a.title.toLowerCase().includes(expression.toLowerCase());
        });
    }

    incrementCounter() {
        this.count++;
        if (this.count === this.state.data.length) {
            this.props.loadHandler();
        }
    }

    render() {
        return this.state.filtered.map(addon => {
            return (
                <li key={addon.file_name + addon.votes + addon.download_count}>
                    <AddonListing title={addon.title}
                        size={addon.size}
                        author={addon.author}
                        custom_url={addon.custom_url}
                        s3_url={addon.s3_url}
                        upload_date={addon.upload_date}
                        category={addon.category}
                        votes={addon.votes}
                        star_rating={addon.star_rating}
                        download_count={addon.download_count}
                        body={addon.body}
                        incrementCounter={this.incrementCounter}
                    />
                </li>
            )
        });
    }
}