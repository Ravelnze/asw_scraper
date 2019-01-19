import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';

const baseUrl = "https://s3-us-west-2.amazonaws.com/"

export default class AddonListing extends Component {
    componentDidMount() {
        this.props.incrementCounter();
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-6">
                            <h5>
                                <a href={baseUrl + this.props.s3_url}>{this.props.title}</a>
                            </h5>
                            <sub>{this.props.size} | {this.props.author}</sub>
                        </div>
                        <div className="col">
                            <div className="row">
                                <div className="col">
                                    <small>{this.props.upload_date}</small>
                                </div>
                                <div className="col">
                                    <small>{this.props.votes} votes</small>
                                </div>
                                <div className="col">
                                    <small>Downloads</small>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <small>{this.props.category}</small>
                                </div>
                                <div className="col">
                                    <StarRatings
                                        rating={parseFloat(this.props.star_rating) / 100.0 * 5.0}
                                        starRatedColor="#4482BD"
                                        numberOfStars={5}
                                        starDimension="20px"
                                        starSpacing="1px"
                                    />
                                </div>
                                <div className="col">
                                    <small>{this.props.download_count}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <p className="card-text" dangerouslySetInnerHTML={ { __html: this.props.body.replace(/\\/g, '') } }>
                    </p>
                </div>
            </div>
        )
    }
}