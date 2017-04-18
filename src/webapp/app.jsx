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

  render() {
    let css = null;
    let script = null;
    if (this.props.assetsHelper) {
      css = (<link rel="stylesheet" href={this.props.assetsHelper.get('app.css')} />);
      script = (<script
        src={this.props.assetsHelper.get('app.js')}
        data-props=""
        id="js-bundle"
      />);
    }

    return (
      <html lang="en-GB">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {css}
          <title>My Title</title>
        </head>
        <body>
          <div>
            <h1>My Title</h1>
            <p>Marvelous server side rendering</p>
            <button onClick={App.handleClick}>Click Me</button>
          </div>
          {script}
        </body>
      </html>
    );
  }
}
