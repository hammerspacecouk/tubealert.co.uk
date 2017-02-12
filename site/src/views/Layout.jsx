'use strict';

require('../../scss/core/_layout.scss');

const React = require('react');
const Link = require('react-router').Link;

module.exports = React.createClass({
    render: function() {
        return (
            <div>
                <h1>TubeAlert</h1>
                <p><Link to={'settings'}>Setting</Link></p>
                <p><Link to={'bakerloo-line'}>Bakerloo</Link></p>
                <p>Render me bitch!</p>
                {this.props.children}
            </div>
        );
    }
});
