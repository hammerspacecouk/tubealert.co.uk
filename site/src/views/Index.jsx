'use strict';

const React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {};
    },
    loadPixels: function() {
        // console.log('run me');
        // if (this.state.pixels.length > 0) {
        //     return;
        // }
        //
        // fetch('/api').then((response) => {
        //     return response.json();
        // }).then((data) => {
        //     this.setState({pixels: data});
        // }).catch((err) => {
        //     throw new Error(err);
        // });
    },
    componentDidMount: function() {
        // this.loadPixels();
    },
    render: function() {
        return (
            <div>
                Nothing here yet
            </div>
        )
    }
});
