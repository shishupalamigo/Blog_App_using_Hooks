import React from 'react';
import Loader from './Loader';
import { Link, withRouter } from 'react-router-dom';
import { ArticlesURL, localStorageKey } from '../utilities/constants';
import CommentBox from './CommentBox';

class Article extends React.Component {
  constructor(props) {
    super();
    this.state = {
      article: '',
      error: '',
    };
  }

  componentDidMount() {
    this.getArticle();
  }

  getArticle = () => {
    let slug = this.props.match.params.slug;
    fetch(ArticlesURL + `/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        this.setState({ article: data.article });
      })
      .catch((err) => {
        this.setState({ error: 'Not able to fetch Articles' });
      });
  };

  getDate = (date) => {
    let newDate = new Date(date).toISOString().split('T')[0];
    return newDate;
  };
  handleEdit = () => {
    let { slug } = this.state.article;
    console.log(this.props, 'Article props from edit');
    this.props.history.push({
      pathname: `/articles/edit/${slug}`,
      article: this.state.article,
    });
  };

  handleDelete = () => {
    let { user } = this.props;
    // console.log(user.username, 'username');
    fetch(ArticlesURL + '/' + this.props.match.params.slug, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + localStorage[localStorageKey],
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        this.props.history.push(`/profiles/${user.username}`);
      })
      .catch((err) => console.log(err));
  };

  render() {
    let { error, article } = this.state;
    // console.log(this.props);
    let loggedInUser = this.props?.user?.username;
    console.log(this.props, 'from Articles');
    let isLoggedIn = this.props?.isLoggedIn;
    let user = this.props?.user;
    // console.log(loggedInUser, isLoggedIn);
    // console.log(isLoggedIn, user);
    if (error) {
      return <h2 className="text-red-500 text-center text-xl mt-8">{error}</h2>;
    }

    if (!article) {
      return <Loader />;
    }
    let { tagList } = article;

    return (
      <main>
        {/* hero section */}
        <section className="px-20 bg-green-700 text-white py-12">
          <h2 className="mt-2 mb-3 text-4xl">{article.title}</h2>
          <p className="">{article.description}</p>
          <div className="flex py-6 items-center">
            <Link to={`/profiles/${article.author.username}`}>
              <img
                src={article.author.image}
                alt={article.author.username}
                className="w-16 h-16 object-cover rounded-full"
              />
            </Link>
            <span className="mx-3">{article.author.username}</span>
            <span className="mx-3">{this.getDate(article.createdAt)}</span>
          </div>
          <div className="flex">
            {tagList.map((tag) => {
              return (
                <span
                  key={tag}
                  className="mr-3 bg-blue-500 p-1 px-2 text-xs rounded-md"
                >
                  {tag}
                </span>
              );
            })}
          </div>
          {isLoggedIn && user.username === article.author.username && (
            <div className="float-right">
              <span
                className={
                  'btn bg-gray-300 text-gray-600 rounded-md mx-3 cursor-pointer'
                }
                onClick={this.handleEdit}
              >
                <i className="far fa-edit mr-2"></i> Edit
              </span>

              <span
                className={
                  'bg-red-700 btn text-white rounded-md mx-3 cursor-pointer'
                }
                onClick={this.handleDelete}
              >
                <i className="far fa-trash-alt mr-2"></i>Delete
              </span>
            </div>
          )}

          {}
        </section>

        {/* article body */}
        <section className="px-20 py-12">
          <p className="text-lg text-gray-700 bg-yellow-100 px-5 py-5 border shadow-xl">
            {article.body}
          </p>
        </section>
        <section className="px-20 py-12">
          <CommentBox {...this.props} slug={article.slug} />
          {!loggedInUser && (
            <div className="flex justify-center mt-10 mb-5">
              <h3 className="text-xl text-gray-600">
                Please
                <Link to="/login" className="text-green-700 mx-1">
                  Login
                </Link>
                to Add Comments on the Article
              </h3>
            </div>
          )}
        </section>
      </main>
    );
  }
}

export default withRouter(Article);
