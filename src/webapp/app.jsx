import React, { Component, PropTypes } from 'react';

export default class App extends Component {
  static propTypes() {
    return {
      assetsHelper: PropTypes.object.isRequired
    };
  }

  static handleClick() {
    window.alert('me me me ');
  }

  render() {
    return (
      <html lang="en-GB">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href={this.props.assetsHelper.get('app.css')} />
          <title>My Title</title>
        </head>
        <body>
          <div>
            <h1>My Title</h1>
            <p>Marvelous server side rendering</p>
            <button onClick={App.handleClick}>Click Me</button>
          </div>
          <script
            src={this.props.assetsHelper.get('app.js')}
            data-props=""
            id="js-bundle"
          />
        </body>
      </html>
    );
  }
}
