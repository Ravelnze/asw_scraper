import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';

const baseUrl = "https://s3-us-west-2.amazonaws.com/"

export default class AddonListing extends Component {
    componentDidMount() {
        this.props.incrementCounter();
        window.$('[data-toggle="popover"]').popover();
    }

    generateHTML() {
        return "<table><tbody><tr><td>Uploaded</td><td>" + this.props.upload_date + "</td></tr><tr><td>Category</td><td>" + this.props.category + "</td></tr><tr><td>Downloads</td><td>" + this.props.download_count + "</td></tr></tbody></table>"
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-8">
                            <div className="row">
                                <div className="col">
                                    <h5 className="mb-0">
                                        <a href={this.props.s3_url != null ? baseUrl + this.props.s3_url : this.props.custom_url}>{this.props.title}</a>
                                    </h5>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <small>{this.props.size} | {this.props.author} | <i className="fas fa-info"
                                            data-trigger="hover"
                                            data-toggle="popover" 
                                            data-placement="top" 
                                            data-content={this.generateHTML()}
                                            data-html="true"></i>
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="col text-right">
                            <div className="row">
                                <div className="col">
                                    <StarRatings
                                        rating={parseFloat(this.props.star_rating) / 100.0 * 5.0}
                                        starRatedColor="#4482BD"
                                        numberOfStars={5}
                                        starDimension="14px"
                                        starSpacing="1px"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <small>{this.props.votes} votes</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <p className="card-text" dangerouslySetInnerHTML={ { __html: this.props.body.length > 0 ? this.props.body.replace(/\\/g, '') : "No description." } }></p>
                </div>
            </div>
        )
    }
}