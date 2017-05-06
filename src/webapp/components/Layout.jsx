import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Alert from './Icons/Alert.jsx';
import ChevronLeft from './Icons/ChevronLeft.jsx';
import ChevronRight from './Icons/ChevronRight.jsx';
import SettingsIcon from './Icons/Settings.jsx';

const createLine = (line) => {
  const className = `statusbox linebox linebox--${line.urlKey}`;
  let alert = null;
  if (line.isDisrupted) {
    alert = <div className="statusbox__alert"><Alert /></div>;
  }
  return (
    <li key={line.urlKey}>
      <Link to={`/${line.urlKey}`} className={className}>
        <div className="statusbox__name">
          {line.name}
          <br />
          <span>{line.statusSummary}</span>
        </div>
        {alert}
        <div className="statusbox__chevron"><ChevronRight /></div>
      </Link>
    </li>
  );
};

const Layout = ({ innerChildren, lines, appClass, warningMessage }) => (
  <div className={appClass}>
    <div className="app__main">
      <div className="app__header header">
        <header>
          <div className="header__logo">
            <Link to="/">TubeAlert</Link>
          </div>
          <div className="header__back">
            <Link to="/"><ChevronLeft /></Link>
          </div>
          <div className="header__settings">
            <Link to="/settings">
              <SettingsIcon />
            </Link>
          </div>
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
    {warningMessage}
  </div>
);

Layout.propTypes = {
  appClass: PropTypes.string.isRequired,
  innerChildren: PropTypes.element.isRequired,
  lines: PropTypes.arrayOf(PropTypes.object).isRequired,
  warningMessage: PropTypes.element.isRequired
};

export default Layout;
