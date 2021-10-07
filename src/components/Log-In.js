import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { validations } from '../utilities/validations';
import { Login_URL } from '../utilities/constants';
import { withRouter } from 'react-router';
import UserContext from '../context/UserContext';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const info = useContext(UserContext);

  function handleChange({ target }) {
    let { name, value } = target;
    if (name === 'email') {
      validations(errors, name, value);
      if (!errors) {
        setErrors({ ...errors, email: errors });
      } else {
        setEmail(value);
      }
    } else if (name === 'password') {
      validations(errors, name, value);
      if (!errors) {
        setErrors({ ...errors, password: errors });
      } else {
        setPassword(value);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (password && email) {
      fetch(Login_URL, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ user: { password: password, email } }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(({ errors }) => {
              return Promise.reject(errors);
            });
          }
          return res.json();
        })
        .then(({ user }) => {
          info.handleUser(user);
          setEmail('');
          setPassword('');
          props.history.push('/articles');
        })
        .catch((error) => {
          setErrors({ ...errors, email: 'Email or Password is incorrect!' });
        });
    }
  }

  return (
    <main className="bg-gray-300 pb-20">
      <section className="py-20">
        <form
          className="w-1/3 mx-auto border border-gray-400 p-6 rounded-md shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="text-center">
            <legend className="text-2xl font-bold">Sign In</legend>
            <Link to="/register">
              <span className="text-gray-700 text-lg text-center">
                {' '}
                New here?{' '}
              </span>
            </Link>
          </div>
          <fieldset className="my-3">
            <input
              className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md"
              type="text"
              placeholder="Enter Email"
              value={email}
              name="email"
              onChange={(e) => handleChange(e)}
            />
            <span className="text-red-500">{errors.email}</span>

            <input
              className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md"
              type="password"
              placeholder="Enter Password"
              value={password}
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <span className="text-red-500">{errors.password}</span>

            <input
              type="submit"
              value="Log In"
              className="block w-full my-6 py-2 px-3 btn btn-primary cursor-pointer"
              disabled={errors.password || errors.email}
            />
          </fieldset>
        </form>
      </section>
    </main>
  );
}

export default withRouter(Login);
