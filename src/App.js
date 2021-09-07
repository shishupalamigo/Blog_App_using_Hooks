import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Signup from './components/Sign-Up';
import Login from './components/Log-In';
import ArticlesHome from './components/ArticlesHome';
import Article from './components/Article';
import NewArticle from './components/New-Article';
import Settings from './components/Settings';
import Profile from './components/Profile';
import FullPageLoader from './components/FullPageLoader';
import NotFound from './components/NotFound';

import { localStorageKey, UserVerifyURL } from './utilities/constants';

class App extends React.Component {
  state = {
    isLoggedIn: false,
    user: null,
    isVerifying: true,
  };

  componentDidMount() {
    let storageKey = localStorage[localStorageKey];
    if (storageKey) {
      fetch(UserVerifyURL, {
        method: 'GET',
        headers: {
          authorization: `Token ${storageKey}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        })
        .then(({ user }) => this.updateUser(user))
        .catch((errors) => console.log(errors));
    } else {
      this.setState({ isVerifying: false });
    }
  }
  updateUser = (user) => {
    this.setState({ isLoggedIn: true, user, isVerifying: false });
    localStorage.setItem(localStorageKey, user.token);
  };

  render() {
    if (this.state.isVerifying) {
      return <FullPageLoader />;
    }
    return (
      <Router>
        <Header isLoggedIn={this.state.isLoggedIn} user={this.state.user} />
        {this.state.isLoggedIn ? (
          <AuthenticatedApp {...this.state} />
        ) : (
          <UnAuthenticatedApp updateUser={this.updateUser} />
        )}
      </Router>
    );
  }
}
function AuthenticatedApp(props) {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/articles" exact>
        <ArticlesHome {...props} />
      </Route>
      <Route path="/articles/:slug" component={Article} />
      <Route path="/new-article" exact>
        <NewArticle />
      </Route>
      <Route path="/settings" exact>
        <Settings />
      </Route>
      <Route path="/profile" exact>
        <Profile />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

function UnAuthenticatedApp(props) {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/register" exact>
        <Signup updateUser={props.updateUser} />
      </Route>
      <Route path="/login" exact>
        <Login updateUser={props.updateUser} />
      </Route>
      <Route path="/articles" exact>
        <ArticlesHome {...props} />
      </Route>
      <Route path="/articles/:slug" component={Article} />
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default App;
