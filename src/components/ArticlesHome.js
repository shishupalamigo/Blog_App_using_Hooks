import React, { useState, useEffect, useContext } from 'react';
import Articles from './Articles';
import Tags from './Tags';
import {
  Articles_URL,
  Feed_URL,
  Local_Storage_Key,
} from '../utilities/constants';
import Pagiantion from './Pagination';
import UserContext from '../context/UserContext';

function ArticlesHome(props) {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState('');
  const [articlesCount, setArticlesCount] = useState(0);
  const [articlesPerPage] = useState(10);
  const [activePageIndex, setActivePageIndex] = useState(1);
  const [tagSelected, setTagSelected] = useState('');
  const [url, setUrl] = useState(Articles_URL);
  const info = useContext(UserContext);
  let { isLoggedIn } = info.data;

  function getArticles(url, activePageIndex, articlesPerPage, tagSelected) {
    let token = localStorage[Local_Storage_Key];
    fetch(
      url +
        `/?offset=${(activePageIndex - 1) * 10}&limit=${articlesPerPage}` +
        (tagSelected && `&tag=${tagSelected}`),
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
        setArticles(data.articles);
        setArticlesCount(data.articlesCount);
      })
      .catch((err) => {
        setError('Not able to fetch Articles');
      });
  }

  useEffect(() => {
    getArticles(url, activePageIndex, articlesPerPage, tagSelected);
    return () => {};
  }, [url, activePageIndex, articlesPerPage, tagSelected]);

  function updateCurrentPageIndex(index) {
    setActivePageIndex(index);
    setTagSelected('');
  }

  function selectTag({ target }) {
    let { value } = target.dataset;
    setTagSelected(value);
    setActivePageIndex(1);
    setUrl(Articles_URL);
  }

  function handleFavorite({ target }) {
    let { id, slug } = target.dataset;
    let method = id === 'false' ? 'POST' : 'DELETE';
    if (isLoggedIn) {
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
          if (url === Feed_URL) {
            getArticles(
              Feed_URL,
              activePageIndex,
              articlesPerPage,
              tagSelected
            );
          } else {
            getArticles(
              Articles_URL,
              activePageIndex,
              articlesPerPage,
              tagSelected
            );
          }
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    // Hero section
    <main className="px-24 py-16 w-full">
      {/* feeds part */}
      <div className="flex mb-3">
        <span
          className={
            url === Articles_URL
              ? 'cursor-pointer mr-8 text-xl text-green-500'
              : 'cursor-pointer mr-8 text-xl text-gray-600'
          }
          onClick={() => {
            setTagSelected('');
            setUrl(Articles_URL);
          }}
        >
          <i className="fas fa-newspaper mr-2"></i>
          Global Feed
        </span>
        {isLoggedIn && (
          <span
            className={
              url === Feed_URL
                ? 'text-xl mr-8 cursor-pointer text-green-500'
                : 'text-xl  cursor-pointer text-gray-600'
            }
            onClick={() => {
              setTagSelected('');
              setUrl(Feed_URL);
              setActivePageIndex(1);
            }}
          >
            {' '}
            <i className="fas fa-newspaper mr-2"></i>
            My feed
          </span>
        )}

        {tagSelected && (
          <div className="text-xl">
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-green-700">#{tagSelected}</span>
          </div>
        )}
      </div>

      {/* articles part */}
      <section className="flex justify-between ">
        <div className="w-4/6">
          <Articles
            articles={articles}
            error={error}
            handleFavorite={handleFavorite}
          />
        </div>

        {/* tags part */}
        <div className="w-80">
          <Tags selectTag={selectTag} />
        </div>
        {/* Pagination */}
      </section>
      <div className="mt-10">
        <Pagiantion
          articlesCount={articlesCount}
          articlesPerPage={articlesPerPage}
          activePageIndex={activePageIndex}
          updateCurrentPageIndex={updateCurrentPageIndex}
        />
      </div>
    </main>
  );
}

export default ArticlesHome;
