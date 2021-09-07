import { NavLink } from 'react-router-dom';

function Header(props) {
  return (
    <header className="flex justify-between bg-green-50 px-20 py-8">
    <NavLink to="/">
      <h1 className="text-4xl font-extrabold text-gray-700 font-logo">
        Alt Blog
      </h1>
    </NavLink>
    <nav className="flex">
    {
      props.isLoggedIn ? <AuthHeader /> : <NonAuthHeader />
    }
    </nav>
  </header> 
  )

}

function AuthHeader(props) {
  return (

      <nav className="flex">
      <NavLink
          to="/articles"
          activeClassName="btn-active"
          className="btn btn-green mr-5"
        >
          Home
        </NavLink>
        <NavLink
          to="/new-article"
          activeClassName="btn-active"
          className="btn btn-green mr-5"
        >
          New Article
        </NavLink>
        <NavLink
          to="/settings"
          activeClassName="btn-active"
          className="btn btn-green mr-5"
        >
          Settings
        </NavLink>
        <NavLink
          to="/profile"
          activeClassName="btn-active"
          className="btn btn-green"
        >
          Profile
        </NavLink>
      </nav>
  );
}
function NonAuthHeader(props) {
  return (
    
      <nav className="flex">
      <NavLink
          to="/articles"
          activeClassName="btn-active"
          className="btn btn-green mr-5"
        >
          Home
        </NavLink>
        <NavLink
          to="/register"
          activeClassName="btn-active"
          className="btn btn-green mr-5"
        >
          Sign-Up
        </NavLink>
        <NavLink
          to="/login"
          activeClassName="btn-active"
          className="btn btn-green"
        >
          Log-In
        </NavLink>
      </nav>
  );
}


export default Header;
