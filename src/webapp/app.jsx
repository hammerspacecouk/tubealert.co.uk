import React, { Component, PropTypes } from 'react';

export default class App extends Component {
  static propTypes() {
    return {
      assetsHelper: PropTypes.object
    };
  }

  static handleClick() {
    window.alert('me me me ');
  }

  constructor() {
    super();
    this.nothing = () => 'yes';
  }

  render() {
    this.nothing();

    return (
      <div>
        <h1>My Title</h1>
        <p>Marvelous server side rendering</p>
        <button onClick={App.handleClick}>Click Me</button>
      </div>
    );
  }
}
