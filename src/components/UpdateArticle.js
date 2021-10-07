import React, { useState, useEffect } from 'react';
import { Articles_URL, Local_Storage_Key } from '../utilities/constants';
import { withRouter } from 'react-router';
import Loader from './Loader';

function UpdateArticle(props) {
  const [state, setState] = useState({
    article: '',
    title: '',
    description: '',
    body: '',
    tags: '',
    error: '',
  });

  let slug = props.match.params.slug;
  useEffect(() => {
    fetch(Articles_URL + `/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ article }) => {
        let { title, description, tagList, body } = article;
        setState((state) => {
          return {
            ...state,
            article: article,
            title: title,
            body: body,
            description: description,
            tags: tagList.join(','),
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {};
  }, [slug]);

  function handleChange({ target }) {
    let { name, value } = target;
    setState({ ...state, [name]: value });
  }

  function handleSubmit(event) {
    let { title, description, body, tags } = state;
    let token = 'Bearer ' + localStorage[Local_Storage_Key];
    event.preventDefault();
    if (title && description && body && tags) {
      fetch(Articles_URL + '/' + slug, {
        method: 'PUT',
        body: JSON.stringify({
          article: {
            title,
            description,
            body,
            tagList: tags.split(',').map((tag) => tag.trim()),
          },
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
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
          props.history.push(`/articles/${props.match.params.slug}`);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setState({ ...state, error: 'Enter all fields' });
    }
  }

  let { title, description, body, tags, error, article } = state;
  if (!article) {
    return <Loader />;
  }
  return (
    <main>
      <section className="pt-20">
        <form
          className="w-1/2 mx-auto p-8 border border-gray-400 rounded-md"
          onSubmit={handleSubmit}
        >
          <legend className="text-3xl text-center font-bold my-3 text-indigo-900">
            Edit Article
          </legend>
          <fieldset className="flex flex-col">
            <span className="text-red-500 my-1">{error}</span>
            <input
              type="text"
              value={title}
              placeholder="Title"
              name="title"
              onChange={handleChange}
              className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500"
            />
            <input
              type="text"
              value={description}
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500"
            />
            <textarea
              rows="6"
              value={body}
              name="body"
              placeholder="Articles's Body"
              onChange={handleChange}
              className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500"
            ></textarea>
            <input
              type="text"
              value={tags}
              name="tags"
              placeholder="Tag List(comma seperated)"
              onChange={handleChange}
              className="my-2 p-2 rounded-md outline-none border-2 border-gray-300 focus:border-blue-500"
            />
            <input
              type="submit"
              value="Update Article"
              className="btn w-2/6 self-end bg-blue-500 hover:bg-blue-400 text-white "
            />
          </fieldset>
        </form>
      </section>
    </main>
  );
}

export default withRouter(UpdateArticle);
