import React from 'react';
import Articles from './Articles';
import Tags from './Tags';

class ArticlesHome extends React.Component {
  constructor(props) {
    super();

    this.state = {
      articles: null,
      error: '',
      articlesCount: null,
      articlesPerPage: 10,
      activePage: 1,
      tagSelected: '',
    };
  }

  componentDidMount() {
    this.getArticles();
  }

  handleClick = ({ target }) => {
    let { id } = target.dataset;
    this.setState({ activePage: id }, this.getArticles);
  };

  getArticles = () => {
    let offset = (this.state.activePage - 1) * 10;
    let tag = this.state.tagSelected;
    fetch(
      `https://mighty-oasis-08080.herokuapp.com/api/articles/?limit=${this.state.articlesPerPage}&offset=${offset}` +
        (tag && `&tag=${tag}`)
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
        });
      })
      .catch((err) => {
        this.setState({ error: 'Not able to fetch Articles' });
      });
  };

  selectTag = ({ target }) => {
    let { value } = target.dataset;
    this.setState({ tagSelected: value }, this.getArticles);
  };
  render() {
    let { articles, error } = this.state;

    return (
      // Hero section
      <main className="px-24 py-16 w-full">
        {/* feeds part */}
        <div className="flex mb-3">
          <span
            className="cursor-pointer text-xl text-blue-900"
            onClick={() =>
              this.setState(
                {
                  tagSelected: '',
                },
                this.getArticles
              )
            }
          >
            Global Feed{' '}
          </span>
          <div
            className={this.state.tagSelected ? 'visible text-xl' : 'hidden'}
          >
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-green-700">#{this.state.tagSelected}</span>
          </div>
        </div>

        {/* articles part */}
        <section className="flex justify-between ">
          <div className="w-4/6">
            <Articles articles={articles} error={error} />
          </div>

          {/* tags part */}
          <div className="w-80">
            <Tags selectTag={this.selectTag} />
          </div>
        </section>
      </main>
    );
  }
}

export default ArticlesHome;
