import { NavLink, withRouter } from 'react-router-dom';
import { Local_Storage_Key } from '../utilities/constants';

function Header(props) {
  function handleLogout() {
    localStorage.removeItem(Local_Storage_Key);
    props.handleLogout();
    props.history.push("/articles")
  }
  return (
    <header className="flex justify-between bg-gray-700 px-20 py-8 shadow-md rounded-md">
      <NavLink to="/">
        <h1 className="text-4xl font-extrabold text-gray-50 font-logo">
          Alt Blog
        </h1>
      </NavLink>
      <nav className="flex">
        {props.isLoggedIn ? (
          <AuthHeader {...props} handleLogout={handleLogout} />
        ) : (
          <NonAuthHeader />
        )}
      </nav>
    </header>
  );
}

function AuthHeader(props) {
  return (
    <nav className="flex items-center">
      <NavLink
        to={{
          user: props.user,
          pathname: `/profiles/${props.user.username}`,
        }}
        className="btn mr-5 btn-primary"
        activeClassName="btn-active"
      >
        <li className="flex items-center text-xl mx-3">
          <img
            src={props.user.image || "smiley.png"} 
            alt={props.user.username}
            className="w-5 h-5 rounded-full"
          />
          <span className="ml-2 text-gray-50 font-medium">{props.user.username}</span>
        </li>
      </NavLink>
      <NavLink
        to="/articles"
        className="btn btn-primary mr-5"
        activeClassName="btn-active"
      >
        Home
      </NavLink>
      <NavLink
        to="/new-article"
        activeClassName="btn-active"
        className="btn btn-primary mr-5"
      >
        New Article
      </NavLink>
      <button className="btn btn-primary" onClick={props.handleLogout}>
        Logout
      </button>
    </nav>
  );
}
function NonAuthHeader(props) {
  return (
    <nav className="flex">
      <NavLink
        to="/articles"
        activeClassName="btn-active"
        className="btn btn-primary mr-5"
      >
        Home
      </NavLink>
      <NavLink
        to="/register"
        activeClassName="btn-active"
        className="btn btn-primary mr-5"
      >
        Sign-Up
      </NavLink>
      <NavLink
        to="/login"
        activeClassName="btn-active"
        className="btn btn-primary"
      >
        Log-In
      </NavLink>
    </nav>
  );
}

export default withRouter(Header);
