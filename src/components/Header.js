import { NavLink, withRouter } from 'react-router-dom';
import { Local_Storage_Key } from '../utilities/constants';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

function Header(props) {
  let userData = useContext(UserContext);
  let { isLoggedIn } = userData.data;
  let { handleLogout } = userData;

  function logout() {
    localStorage.removeItem(Local_Storage_Key);
    handleLogout();
    props.history.push('/articles');
  }
  return (
    <header className="flex justify-between sm:flex-col bg-gray-700 px-20 py-8 shadow-md rounded-md md:flex-row">
      <NavLink to="/">
        <h1 className="text-4xl font-extrabold text-gray-50 font-logo">
          Alt Blog
        </h1>
      </NavLink>
      <nav className="flex">
        {isLoggedIn ? <AuthHeader handleLogout={logout} /> : <NonAuthHeader />}
      </nav>
    </header>
  );
}

function AuthHeader(props) {
  let userData = useContext(UserContext);
  let { user } = userData.data;
  let { handleLogout } = props;
  return (
    <nav className="flex sm:flex-col md:flex-row justify-between flex-wrap items-center">
      <NavLink
        to={{
          user: props.user,
          pathname: `/profiles/${user.username}`,
        }}
        className="btn mr-5 mt:5 md:mt-0 btn-primary"
        activeClassName="btn-active"
      >
        <span className="flex items-center text-xl mx-3">
          <img
            src={user.image || 'smiley.png'}
            alt={user.username}
            className="w-5 h-5 rounded-full"
          />
          <span className="ml-2 text-gray-50 font-medium">{user.username}</span>
        </span>
      </NavLink>
      <NavLink
        to="/articles"
        className="btn btn-primary mr-5 mt-5 md:mt-0"
        activeClassName="btn-active"
      >
        Home
      </NavLink>
      <NavLink
        to="/new-article"
        activeClassName="btn-active"
        className="btn btn-primary mr-5 mt-5 md:mt-0"
      >
        New Article
      </NavLink>
      <button className="btn btn-primary mt-5 lg:mt-0" onClick={handleLogout}>
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
