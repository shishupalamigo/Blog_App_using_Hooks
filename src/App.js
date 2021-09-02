import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Signup from "./components/Sign-Up";
import Login from "./components/Log-In";
import ArticlesHome from "./components/ArticlesHome";
import Article from "./components/Article";
import NotFound from "./components/NotFound";

function App(props) {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/register" exact>
          <Signup />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/articles" exact>
          <ArticlesHome />
        </Route>
        <Route path="/articles/:slug" component={Article} />
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
