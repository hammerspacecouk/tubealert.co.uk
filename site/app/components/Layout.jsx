'use strict';

import React, {PropTypes} from 'react';
import {Link} from 'react-router';

// ensure the overall page has the core css
// individual modules will then pull in atoms, molecules and organisms as they need them
import 'scss/core/_core.scss';
import 'scss/molecules/_linebox.scss';

const createLine = line => {
    const className = `linebox linebox--${line.urlKey}`;
    return (
        <li key={line.urlKey}>
            <Link to={'/' + line.urlKey} className={className}>{line.name} ({line.statusSummary})</Link>
        </li>
    );
};

const Layout = ({innerChildren, lines}) => (
    <div>
        <h1><Link to={'/'}>TubeAlert</Link></h1>
        <p><Link to={'/settings'}>Setting</Link></p>
        <p><Link to={'/bakerloo-line'}>Bakerloo</Link></p>
        <ul className="lines">
            {lines.map(createLine)}
        </ul>
        {innerChildren}
    </div>
);

Layout.propTypes = {
    innerChildren: PropTypes.element.isRequired,
    lines: PropTypes.array.isRequired
};

export default Layout;