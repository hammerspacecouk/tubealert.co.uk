import React from "react";
import PropTypes from "prop-types";
import Disruptions from "./Line/Disruptions.jsx";
import NotificationsContainer from "../containers/NotificationsContainer.jsx";

const Line = ({ line }) => {
  const className = `g-unit island linebox linebox--${line.urlKey}`;
  return (
    <div>
      <div className={className}>
        <h1 className="page-limit">{line.name}</h1>
      </div>
      <div className="page-limit">
        <div className="grid">
          <div className="g 3/5@xxl 2/3@xxxl">
            <Disruptions line={line} />
          </div>
          <div className="g 2/5@xxl 1/3@xxxl">
            <NotificationsContainer line={line} />
          </div>
        </div>
      </div>
    </div>
  );
};

Line.propTypes = {
  line: PropTypes.object.isRequired,
};

export default Line;
