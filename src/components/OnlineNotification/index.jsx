import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './style.scss';

class OnlineNotification extends Component {
  constructor() {
    super();
    this.state = {
      isOnline: null
    };
  }

  componentWillMount() {
    this.checkConnection();
    window.addEventListener('online', this.checkConnection.bind(this));
    window.addEventListener('offline', this.checkConnection.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.checkConnection.bind(this));
    window.removeEventListener('offline', this.checkConnection.bind(this));
  }

  checkConnection() {
    const isOnline = navigator.onLine;
    this.setState({ isOnline });
  }

  renderNotification() {
    return(<div className="this-offline-notification">You are offline :(</div>);
  }

  render() {
    return (
      <div className="OnlineNotification">{!this.state.isOnline ? this.renderNotification() : null}</div>
    );
  }
}

export default withRouter(OnlineNotification);
