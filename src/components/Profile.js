import React, { useState, useEffect, useContext } from 'react';
import Loader from './Loader';
import {
  Articles_URL,
  Profile_URL,
  Local_Storage_Key,
} from '../utilities/constants';
import Articles from './Articles';
import Pagination from './Pagination';
import { withRouter, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

function Profile(props) {
  const [state, setState] = useState({
    user: '',
    articles: null,
    articlesCount: null,
    articlesPerPage: 10,
    activePageIndex: 1,
    feedSelected: 'author',
    following: '',
    favoriteCount: 0,
    error: '',
  });
  const info = useContext(UserContext);

  const id = props.match.params.id;
  useEffect(() => {
    function getUserInfo(id) {
      fetch(Profile_URL + id, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage[Local_Storage_Key],
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(({ errors }) => {
              return Promise.reject();
            });
          }
          return res.json();
        })
        .then((data) => {
          let profile = data.profile;
          setState((state) => {
            return { ...state, user: profile, following: profile.following };
          });
        })
        .catch((err) => console.log(err));
    }
    getUserInfo(id);
  }, [id]);

  var feedUser = state.user.username;
  useEffect(() => {
    let offset = (state.activePageIndex - 1) * 10;
    let token = localStorage[Local_Storage_Key];
    if (feedUser) {
      fetch(
        `${Articles_URL}?${state.feedSelected}=${feedUser}&limit=${state.articlesPerPage}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        })
        .then((data) => {
          setState((state) => {
            return {
              ...state,
              articles: data.articles,
              articlesCount: data.articlesCount,
            };
          });
        })
        .catch((err) => {
          setState((state) => {
            return { ...state, error: 'Not able to fetch Articles' };
          });
        });
    }
  }, [
    feedUser,
    state.feedSelected,
    state.activePageIndex,
    state.articlesPerPage,
    state.favoriteCount,
  ]);

  function handleClick({ target }) {
    let { id } = target.dataset;
    setState({ ...state, activePageIndex: id });
  }

  function updateCurrentPageIndex(index) {
    setState({ ...state, activePageIndex: index });
  }

  function handleFollow() {
    // getUserInfo();
    let { username } = state.user;
    let { following } = state;
    let method = following ? 'DELETE' : 'POST';
    fetch(Profile_URL + '/' + username + '/follow', {
      method: method,
      headers: {
        Authorization: 'Bearer ' + localStorage[Local_Storage_Key],
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject();
          });
        }
        return res.json();
      })
      .then(({ profile }) => {
        // console.log(profile);
        setState({ ...state, following: profile.following });
      })
      .catch((err) => console.log(err));
  }

  function handleFavorite({ target }) {
    let { id, slug, count } = target.dataset;
    let method = id === 'false' ? 'POST' : 'DELETE';
    fetch(Articles_URL + '/' + slug + '/favorite', {
      method: method,
      headers: {
        Authorization: 'Token ' + localStorage[Local_Storage_Key],
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then((data) => {
        // getFeedArticles();
        setState({ ...state, favoriteCount: count + 1 });
      })
      .catch((err) => console.log(err));
  }

  if (!state.user) {
    return <Loader />;
  }
  let { username, image, bio } = state.user;
  // let loggedInUser = this.props?.user?.username;
  let loggedInUser = info.data?.user?.username;
  let {
    articles,
    error,
    articlesCount,
    activePageIndex,
    articlesPerPage,
    feedSelected,
    following,
  } = state;
  return (
    <main>
      <section>
        <div className="bg-indigo-200 text-white py-16 text-center">
          <img
            src={image}
            alt={username}
            className="w-40 h-40 rounded-full mx-auto"
          />
          <h2 className="text-4xl my-4 text-gray-700">{username}</h2>
          <h3 className="text-2xl text-gray-500 mb-5">{bio}</h3>
          <div className="float-right mr-10 ">
            {loggedInUser && loggedInUser !== username && (
              <button
                className="bg-gray-200 text-gray-700 btn rounded-full hover:bg-gray-300 transform transition duration-500 hover:scale-105"
                onClick={handleFollow}
              >
                <i
                  className={
                    !following ? 'fas fa-plus mr-2' : 'fas fa-minus mr-2'
                  }
                ></i>
                {!following ? 'follow' : 'unfollow'}
              </button>
            )}
            {loggedInUser && loggedInUser === username && (
              <Link
                to="/settings"
                className="btn bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                <i className="fas fa-user-edit mr-2"></i>Edit Profile
              </Link>
            )}
          </div>
        </div>

        <article className="px-40">
          <div className="py-6">
            <span
              className={
                feedSelected === 'author'
                  ? 'cursor-pointer text-xl text-green-500 pb-2 border-b-2 border-green-500'
                  : 'cursor-pointer text-xl text-gray-700'
              }
              onClick={() => {
                setState({
                  ...state,
                  feedSelected: 'author',
                  activePageIndex: 1,
                });
                // getFeedArticles();
              }}
            >
              <i className="fas fa-newspaper mr-2"></i>
              Articles written
            </span>
            <span className="mx-4">/</span>
            <span
              className={
                feedSelected === 'favorited'
                  ? 'cursor-pointer text-xl text-green-500 pb-2 border-b-2 border-green-500'
                  : 'cursor-pointer text-xl text-gray-700'
              }
              onClick={() => {
                setState({
                  ...state,
                  feedSelected: 'favorited',
                  activePageIndex: 1,
                });
                // getFeedArticles();
              }}
            >
              <i className="fas fa-newspaper mr-2"></i>
              Favorited
            </span>
          </div>
          <div className="">
            <Articles
              articles={articles}
              error={error}
              isLoggedIn={info.data.isLoggedIn}
              handleFavorite={handleFavorite}
            />
          </div>
        </article>
        <div className="text-center py-8 flex justify-center">
          <Pagination
            articlesCount={articlesCount}
            articlesPerPage={articlesPerPage}
            activePageIndex={activePageIndex}
            handleClick={handleClick}
            updateCurrentPageIndex={updateCurrentPageIndex}
          />
        </div>
      </section>
    </main>
  );
}

export default withRouter(Profile);
