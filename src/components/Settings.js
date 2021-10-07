import React,{useState, useEffect,useContext} from 'react';
import { validations } from '../utilities/validations';
import { Local_Storage_Key, User_Verify_URL } from '../utilities/constants';
import { withRouter } from 'react-router';
import Loader from './Loader';
import UserContext from "../context/UserContext";

function Settings (props) {
  // constructor(props) {
  //   super();
  //   state = {
  //     image: "",
  //     username: "",
  //     email: "",
  //     password: '',
  //     bio: "",
  //     errors: {
  //       username: '',
  //       email: '',
  //       password: '',
  //     },
  //   };
  // }
  const [state, setState] = useState({
      image: "",
      username: "",
      password: '',
      bio: "",
      errors: {
        username: '',
        password: '',
      },
  })
  const info = useContext(UserContext);

  useEffect(() => {
      let {image, username, bio} = info.data.user;
      setState(state => {
        return {...state, image, username, bio}}
  )}, [info.data])

  function handleChange ({ target }) {
    let { name, value } = target;
    let  errors  = state.errors;
    validations(errors, name, value);
    setState({...state, [name]: value, errors });
  };

  function handleSubmit (event) {
    let { username, image, password, bio, errors } = state;
    event.preventDefault();
    if (username && image && password && bio) {
      fetch(User_Verify_URL, {
        method: 'PUT',
        body: JSON.stringify({
          user: { username, password, bio, image },
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage[Local_Storage_Key],
        },
      })
        .then((res) => {
          // console.log(res);
          if (!res.ok) {
            return res.json().then((data) => {
              for (let key in data.errors) {
                errors[key] = `${key} ${data.errors[key]}`;
              }
              return Promise.reject({ errors });
            });
          }
          return res.json();
        })
        .then((data) => {
          props.history.push(`/profiles/${data.user.username}`);
        })
        .catch((err) => setState({...state, errors }));
    }
  };

    if(!state.username && !state.image && !state.bio) {
      return < Loader />
  }
    let { username, password } = state.errors;

    return (
      <main>
        <section className="py-20">
          <form
            className="w-1/2 mx-auto p-8 border border-gray-400 rounded-md"
            onSubmit={handleSubmit}
          >
            <legend className="text-center text-3xl my-2 font-bold">
              Settings
            </legend>
            <fieldset className="flex flex-col">
              <input
                type="text"
                placeholder="Image Url"
                value={state.image}
                onChange={handleChange}
                name="image"
                className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500"
              />

              <input
                type="text"
                name="username"
                value={state.username}
                onChange={handleChange}
                className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500"
              />
              <span className="my-1 text-red-500">{username}</span>

              <input
                type="password"
                name="password"
                value={state.password}
                placeholder="Password"
                onChange={handleChange}
                className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500"
              />
              <span className="my-1 text-red-500">{password}</span>

              <textarea
                value={state.bio}
                rows="6"
                name="bio"
                placeholder="Enter your Bio"
                onChange={handleChange}
                className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500"
              ></textarea>

              <input
                type="submit"
                value="Update"
                className="btn btn-green"
              ></input>
            </fieldset>
          </form>
        </section>
      </main>
    );
  };

export default withRouter(Settings);
