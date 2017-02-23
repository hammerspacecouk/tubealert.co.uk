'use strict';

import React from 'react';
import {Link} from 'react-router';

export default class Layout extends React.Component {
    render() {
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
}

Layout.propTypes = {
    children: React.PropTypes.element.isRequired
};