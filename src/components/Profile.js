import React from 'react';
import Loader from './Loader';
import {
  ArticlesURL,
  profileURL,
  localStorageKey,
} from '../utilities/constants';
import Articles from './Articles';
import Pagination from './Pagination';
import { withRouter, Link } from 'react-router-dom';

class Profile extends React.Component {
  constructor(props) {
    super();
    // console.log(props.user.profile, "User Profile");
    this.state = {
      user: '',
      articles: null,
      articlesCount: null,
      articlesPerPage: 10,
      activePage: 1,
      feedSelected: 'author',
      following: '',
      error: '',
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = () => {
    let { id } = this.props.match.params;
    fetch(profileURL + id, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage[localStorageKey],
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
        console.log({ profile });
        this.setState(
          { user: profile, following: profile.following },
          this.getFeedArticles
        );
      })
      .catch((err) => console.log(err));
  };

  componentDidUpdate() {
    let user = this.state.user;
    let { id } = this.props.match.params;
    if (user.username !== id) {
      this.getUserInfo();
    }
  }

  handleClick = ({ target }) => {
    let { id } = target.dataset;
    this.setState({ activePage: id }, this.getFeedArticles);
  };

  getFeedArticles = () => {
    let { username } = this.state.user;
    let offset = (this.state.activePage - 1) * 10;
    let token = localStorage[localStorageKey];

    fetch(
      `${ArticlesURL}?${this.state.feedSelected}=${username}&limit=${this.state.articlesPerPage}&offset=${offset}` , {
        method : "GET",
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
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
        });
      })
      .catch((err) => {
        this.setState({ error: 'Not able to fetch Articles' });
      });
  };
  handleFollow = () => {
    this.getUserInfo();
    let { username } = this.state.user;
    let { following } = this.state;
    let method = following ? 'DELETE' : 'POST';
    fetch(profileURL + '/' + username + '/follow', {
      method: method,
      headers: {
        Authorization: 'Bearer ' + localStorage[localStorageKey],
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
        console.log(profile);
        this.setState({ following: profile.following });
      })
      .catch((err) => console.log(err));
  };

  handleFavorite = ({ target }) => {
    let { id, slug } = target.dataset;
    let method = id === 'false' ? 'POST' : 'DELETE';
    console.log(method);
    console.log(id, slug);
    fetch(ArticlesURL + '/' + slug + '/favorite', {
      method: method,
      headers: {
        Authorization: 'Token ' + localStorage[localStorageKey],
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
        this.getFeedArticles();
      })
      .catch((err) => console.log(err));
  };

  render() {
    if (!this.state.user) {
      return <Loader />;
    }
    let { username, image, bio } = this.state.user;
    let loggedInUser = this.props?.user?.username;
    let {
      articles,
      error,
      articlesCount,
      activePage,
      articlesPerPage,
      feedSelected,
      following,
    } = this.state;
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
            <h3 className="text-2xl text-yellow-500 mb-5">{bio}</h3>
            <div className="float-right mr-10 ">
              {loggedInUser !== username && (
                <button
                  className="bg-blue-300 text-gray-700 btn rounded-full hover:bg-blue-400 transform transition duration-500 hover:scale-105"
                  onClick={this.handleFollow}
                >
                  <i className="fas fa-plus mr-2"></i>
                  {!following ? 'follow' : 'unfollow'}
                </button>
              )}
              {loggedInUser === username && (
                <Link
                  to="/settings"
                  className="btn bg-gray-200 text-gray-600 hover:bg-yellow-200"
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
                    : 'cursor-pointer text-xl'
                }
                onClick={() =>
                  this.setState(
                    {
                      feedSelected: 'author',
                      activePage: 1,
                    },
                    this.getFeedArticles
                  )
                }
              >
                <i className="fas fa-newspaper mr-2"></i>
                Articles written
              </span>
              <span className="mx-4">/</span>
              <span
                className={
                  feedSelected === 'favorited'
                    ? 'cursor-pointer text-xl text-green-500 pb-2 border-b-2 border-green-500'
                    : 'cursor-pointer text-xl'
                }
                onClick={() =>
                  this.setState(
                    {
                      feedSelected: 'favorited',
                      activePage: 1,
                    },
                    this.getFeedArticles
                  )
                }
              >
                <i className="fas fa-newspaper mr-2"></i>
                Favorited
              </span>
            </div>
            <div className="">
              <Articles
                articles={articles}
                error={error}
                isLoggedIn={this.props.isLoggedIn}
                handleFavorite={this.handleFavorite}
              />
            </div>
          </article>
          <div className="text-center py-8">
            <Pagination
              articlesCount={articlesCount}
              articlesPerPage={articlesPerPage}
              activePage={activePage}
              handleClick={this.handleClick}
            />
          </div>
        </section>
      </main>
    );
  }
}

export default withRouter(Profile);
