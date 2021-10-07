import React, { useState, useEffect, useContext } from 'react';
import { Articles_URL, Local_Storage_Key } from '../utilities/constants';
import Comments from './Comments';
import UserContext from '../context/UserContext';

function CommentBox(props) {
  const [inputText, setInputText] = useState('');
  const [comments, setComents] = useState('');
  const info = useContext(UserContext);
  let slug = props.slug;

  useEffect(() => {
    getComments(slug);
  }, [slug]);

  function handleChange({ target }) {
    let { value } = target;
    setInputText(value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    let slug = props.slug;
    if (inputText) {
      fetch(Articles_URL + '/' + slug + '/comments', {
        method: 'POST',
        body: JSON.stringify({ comment: { body: inputText } }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage[Local_Storage_Key],
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
          setInputText('');
          setComents('');
          getComments(slug);
        })
        .catch((err) => console.log(err));
    }
  }

  function handleDelete({ target }) {
    let { id } = target.dataset;
    let slug = props.slug;
    fetch(Articles_URL + '/' + slug + '/comments/' + id, {
      method: 'DELETE',
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
        setComents('');
        getComments(slug);
      })
      .catch((err) => console.log(err));
  }

  function getComments(slug) {
    fetch(Articles_URL + '/' + slug + '/comments')
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then(({ comments }) => {
        setComents(comments);
      })
      .catch((err) => console.log(err));
  }

  let loggedInUser = info.data?.user?.username;
  return (
    <>
      {loggedInUser && (
        <div className="">
          <form
            className="my-6 flex flex-col w-1/3"
            onSubmit={(e) => handleSubmit(e)}
          >
            <textarea
              className="w-full border-2 border-gray-400 rounded-md p-3 outline-none focus:border-blue-500"
              rows="3"
              placeholder="Enter Comments"
              value={inputText}
              onChange={(e) => handleChange(e)}
              name="inputText"
            ></textarea>
            <input
              type="submit"
              value="Add Comment"
              className="px-2 py-1 shadow-md btn-primary self-end text-white text-xs rounded-md cursor-pointer hover:bg-blue-400 mt-5"
            />
          </form>
        </div>
      )}

      <div className="my-8">
        <Comments comments={comments} handleDelete={handleDelete} />
      </div>
    </>
  );
}

export default CommentBox;
