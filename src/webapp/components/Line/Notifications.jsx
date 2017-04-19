import React from 'react';
import PropTypes from 'prop-types';
import Alert from '../Icons/Alert.jsx';

const Line = ({ line, children }) => (
  <div className="card">
    <div className="card__body">
      <div className={`card__intro linebox linebox--${line.urlKey}`}>
        <h2 className="c card__heading">Notifications</h2>
        <div className="card__logo"><Alert /></div>
      </div>
      <div>
        {children}
      </div>
    </div>
  </div>
    );

Line.propTypes = {
  line: PropTypes.shape.isRequired,
  children: PropTypes.element.isRequired
};

export default Line;
