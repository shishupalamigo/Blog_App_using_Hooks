import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { Articles_URL, Local_Storage_Key } from '../utilities/constants';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

function NewArticle(props) {
  const [state, setState] = useState({
    title: '',
    description: '',
    tags: '',
    body: '',
    error: '',
  });
  function handleChange({ target }) {
    let { name, value } = target;
    setState({ ...state, [name]: value });
  }

  function handleSubmit(event) {
    let { title, description, tags, body } = state;
    tags = tags.split(',').map((tag) => tag.trim());
    let token = localStorage[Local_Storage_Key];
    event.preventDefault();
    if (title && description && tags && body) {
      fetch(Articles_URL, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          article: { title, description, tagList: tags, body },
        }),
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
          // console.log(data);
          props.history.push(`/articles/${data.article.slug}`);
        })
        .catch((err) => {
          // console.log(err);
          setState({
            ...state,
            error: 'Enter all fields',
          });
        });
    } else {
      setState({
        title: '',
        description: '',
        body: '',
        tags: '',
        error: '',
      });
    }
  }
  function handleEditorChange({ html, text }) {
    setState({ ...state, body: text });
  }
  function clearEditor({ html, text }) {
    return (html = '');
  }

  const mdParser = new MarkdownIt();
  return (
    <main>
      <section>
        <form className="w-2/4 mx-auto mt-10" onSubmit={handleSubmit}>
          <input
            className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md"
            type="text"
            placeholder="Enter Title"
            value={state.title}
            name="title"
            onChange={(e) => handleChange(e)}
          ></input>
          <input
            className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md"
            type="text"
            placeholder="Enter Description"
            value={state.description}
            name="description"
            onChange={(e) => handleChange(e)}
          ></input>
          <input
            className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md"
            type="text"
            placeholder="Enter Tags"
            value={state.tags}
            name="tags"
            onChange={(e) => handleChange(e)}
          ></input>
          <MdEditor
            style={{ height: '500px' }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            onSubmit={clearEditor}
          />
          <input
            type="submit"
            value="Publish Article"
            className="block float-right btn bg-green-500 text-white font-bold cursor-pointer mt-10"
          />
        </form>
      </section>
    </main>
  );
}
export default withRouter(NewArticle);
