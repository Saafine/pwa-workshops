import React, { Fragment, Component } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import List from './List';
import EmptyPage from './EmptyPage';
import TabBar from './TabBar';
import ItemShow from './ItemShow';
import OnlineNotification from './OnlineNotification';

class App extends Component {
  state = {
    wines: [],
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    fetch('https://api-wine.herokuapp.com/api/v1/wines')
      .then(res => res.json())
      .then(data => {
        this.setState({ wines: data });
      });

  };

  renderContent() {
    if (!this.state.wines.length) {
      return <div />;
    }

    return (
      <Fragment>
        <Route
          render={({ location }) => (
            <TransitionGroup>
              <CSSTransition key={location.key} classNames="fade" timeout={1000} appear mountOnEnter>
                <Switch location={location}>
                  <Route exact path="/" component={() => <List items={this.state.wines}/>}/>
                  <Route path="/wine/:id" component={() => <ItemShow items={this.state.wines}/>}/>
                  <Route path="/wishlist" component={EmptyPage}/>
                  <Route path="/cellar" component={EmptyPage}/>
                  <Route path="/articles" component={EmptyPage}/>
                  <Route path="/profile" component={EmptyPage}/>
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )}>
        </Route>
        <TabBar />
      </Fragment>
    );
  }

  render() {
    return (
      <Router>
        <Fragment>
          <OnlineNotification/>
          {this.renderContent()}
        </Fragment>
      </Router>
    );
  }
}

export default App;
