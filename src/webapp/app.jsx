import React, { Component, PropTypes } from 'react';

export default class App extends Component {
  static propTypes() {
    return {
      assetsHelper: PropTypes.object
    };
  }

  constructor() {
    super();
    this.nothing = () => 'yes';
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.nothing();
    console.log('clicked');
    window.alert('me me me ');
  }

  render() {
    console.log('render');
    this.nothing();

    return (
      <div>
        <h1>My Title</h1>
        <p>Marvelous server side rendering</p>
        <button onClick={this.handleClick}>Click Me</button>
      </div>
    );
  }
}
