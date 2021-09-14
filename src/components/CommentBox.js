import React from 'react';
import { ArticlesURL, localStorageKey } from '../utilities/constants';
import Comments from './Comments';

class CommentBox extends React.Component {
  constructor(props) {
    super();
    this.state = {
      inputText: '',
      comments: '',
    };
  }

  componentDidMount() {
    this.getComments();
  }

  handleChange = ({ target }) => {
    let { name, value } = target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let slug = this.props.slug;
    let { inputText } = this.state;
    if (inputText) {
      fetch(ArticlesURL + '/' + slug + '/comments', {
        method: 'POST',
        body: JSON.stringify({ comment: { body: inputText } }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage[localStorageKey],
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
          console.log(data);
          this.setState({ inputText: '', comments: '' }, this.getComments);
        })
        .catch((err) => console.log(err));
    }
  };

  handleDelete = ({ target }) => {
    let { id } = target.dataset;
    console.log(typeof id);
    let slug = this.props.slug;
    fetch(ArticlesURL + '/' + slug + '/comments/' + id, {
      method: 'DELETE',
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
        this.setState({ comments: '' }, this.getComments);
      })
      .catch((err) => console.log(err));
  };

  getComments = () => {
    let slug = this.props.slug;
    fetch(ArticlesURL + '/' + slug + '/comments')
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then(({ comments }) => {
        console.log(comments);
        this.setState({ comments });
      })
      .catch((err) => console.log(err));
  };

  render() {
    let { inputText, comments } = this.state;
    let loggedInUser = this.props?.user?.username;
    return (
      <>
      {
        loggedInUser && (
          <div className="">
          <form className="my-6 flex flex-col w-1/3" onSubmit={this.handleSubmit}>
            <textarea
              className="w-full border-2 border-gray-400 rounded-md p-3 outline-none focus:border-blue-500"
              rows="3"
              placeholder="Enter Comments"
              value={inputText}
              onChange={this.handleChange}
              name="inputText"
            ></textarea>
            <input
              type="submit"
              value="Add Comment"
              className="px-2 py-1 shadow-md btn-green self-end text-white text-xs rounded-md cursor-pointer hover:bg-blue-400 mt-5"
            />
          </form>
        </div>
        )
      }

        <div className="my-8">
          <Comments
            loggedInUser={loggedInUser}
            comments={comments}
            isLoggedIn={this.props.isLoggedIn}
            handleDelete={this.handleDelete}
          />
        </div>
      </>
    );
  }
}

export default CommentBox;
