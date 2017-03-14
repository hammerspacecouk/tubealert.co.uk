'use strict';

import React, {PropTypes} from 'react';
import {Link} from 'react-router-dom';
import Alert from './Icons/Alert.jsx';
import Chevron from './Icons/Chevron.jsx';

const createLine = line => {
    const className = `statusbox linebox linebox--${line.urlKey}`;
    let alert = null;
    if (line.isDisrupted) {
        alert = <div className="statusbox__alert"><Alert /></div>;
    }
    return (
        <li key={line.urlKey}>
            <Link to={'/' + line.urlKey} className={className}>
                <div className="statusbox__name">
                    {line.name}
                    <br />
                    <span>{line.statusSummary}</span>
                </div>
                {alert}
                <div className="statusbox__chevron"><Chevron /></div>
            </Link>
        </li>
    );
};

const Layout = ({innerChildren, lines, appClass}) => (
    <div className={appClass}>
        <div className="app__main">
            <div className="app__header header">
                <header>
                    <div className="header__logo">
                        <Link to={'/'}>TubeAlert</Link>
                    </div>
                    {/*<div class="header__back">*/}
                        {/*<a href="/" id="js-back">*/}
                            {/*<svg><use xlink:href="#icon-chevron-left"></use></svg>*/}
                        {/*</a>*/}
                    {/*</div>*/}
                    {/*<div class="header__settings">*/}
                        {/*<Link to="/settings" id="js-settings">*/}
                            {/*<svg><use xlink:href="#icon-settings"></use></svg>*/}
                        {/*</Link>*/}
                    {/*</div>*/}
                </header>
            </div>
            <div className="page" id="page">
                <main className="main">
                    <div id="main-body">
                        {innerChildren}
                    </div>
                </main>
            </div>
        </div>
        <nav className="app__nav">
            <ol className="app__nav-list list--unstyled">
                {lines.map(createLine)}
            </ol>
        </nav>
    </div>
);

Layout.propTypes = {
    appClass: PropTypes.string.isRequired,
    innerChildren: PropTypes.array.isRequired,
    lines: PropTypes.array.isRequired
};

export default Layout;