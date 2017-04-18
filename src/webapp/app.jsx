import React, {Component} from 'react';

export default class App extends Component {

  handleClick() {
    window.alert('me me me ');
  }

  render() {
    return (
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel='stylesheet' href={this.props.assetsHelper.get('app.css')} />
        <title>My Title</title>
      </head>
      <body>
      <div>
        <h1>My Title</h1>
        <p>Isn't server-side rendering remarkable?</p>
        <button onClick={this.handleClick}>Click Me</button>
      </div>
      <script src={this.props.assetsHelper.get('app.js')}
              data-props=""
              id="js-bundle" />
      </body>
      </html>
    )
  }
}
