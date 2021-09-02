import React from 'react';
import Loader from './Loader';

class Tags extends React.Component {
  constructor(props) {
    super();
    this.state = {
      allTags: null,
      error: '',
    };
  }

  componentDidMount() {
    fetch('https://mighty-oasis-08080.herokuapp.com/api/tags')
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ tags }) => {
        this.setState({ allTags: tags, error: '' });
      })
      .catch((err) => {
        this.setState({ error: 'Not able to fetch Tags' });
      });
  }

  render() {
    let { error, allTags } = this.state;

    if (error) {
      return <h2 className="text-red-500 text-center text-xl mt-8">{error}</h2>;
    }
    if (!allTags) {
      return <Loader />;
    }
    return (
      <div className="flex flex-wrap bg-gray-200 px-4 py-8 rounded-md">
        {allTags.map((tag) => {
        
            return (
              <span
                key={tag}
                className="bg-gray-700 p-2 cursor-pointer text-white text-xs rounded-md mx-1 my-1"
                onClick={(e) => this.props.selectTag(e)}
                data-value={tag}
              >
                {tag}
              </span>
            );
        })}
      </div>
    );
  }
}

export default Tags;
