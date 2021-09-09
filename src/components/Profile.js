import React from 'react';
import Loader from './Loader';
import { ArticlesURL, profileURL } from '../utilities/constants';
import Articles from './Articles';
import Pagination from './Pagination';
import { withRouter, Link } from 'react-router-dom';

class Profile extends React.Component {
  constructor(props) {
    super();
    this.state = {
      user: '',
      articles: null,
      articlesCount: null,
      articlesPerPage: 10,
      activePage: 1,
      feedSelected: 'author',
      error: '',
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = () => {
    let { id } = this.props.match.params;
    fetch(profileURL + id)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        this.setState({ user: data.profile }, this.getArticles);
      });
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
    this.setState({ activePage: id }, this.getArticles);
  };

  getArticles = () => {
    let { username } = this.state.user;
    let offset = (this.state.activePage - 1) * 10;

    fetch(
      `${ArticlesURL}?${this.state.feedSelected}=${username}&limit=${this.state.articlesPerPage}&offset=${offset}`
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
              <button className="bg-blue-300 text-gray-700 btn rounded-full hover:bg-blue-400 transform transition duration-500 hover:scale-105">
              <i class="fas fa-plus mr-2"></i>Follow
              </button>
            )}
            {loggedInUser === username && (
              <Link to="/settings" className="btn bg-gray-200 text-gray-600 hover:bg-yellow-200">
                <i class="fas fa-user-edit mr-2"></i>Edit Profile
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
                    this.getArticles
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
                    this.getArticles
                  )
                }
              >
                <i className="fas fa-newspaper mr-2"></i>
                Favorited
              </span>
            </div>
            <div className="">
              <Articles articles={articles} error={error} />
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
