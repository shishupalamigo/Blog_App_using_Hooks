import React from 'react';
import { withRouter } from 'react-router-dom';
class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };
  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error, errorInfo });
  }

  handleClick = () => {
    this.setState({ hasError: false });
    this.props.history.push('/');
  };

  render() {
    let { hasError } = this.state;
    if (hasError) {
      return (
        <div className="text-center pt-8">
          <h3 className="text-xl text-red-500 my-3">something went wrong</h3>
          <span
            className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer"
            onClick={this.handleClick}
          >
            Go back to Home Page
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
