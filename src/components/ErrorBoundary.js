import React, { Component } from 'react';
import { IMAGE_PATHS } from '../constants/constants';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary:", error, info);
  }

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <img
            src={IMAGE_PATHS.ERROR_OCCURRED}
            alt="에러 발생 - 클릭 시 홈으로 이동"
            title="이미지를 클릭하면 홈으로 이동합니다"
            style={{ ...styles.image, cursor: 'pointer' }}
            onClick={this.handleGoHome}
          />
        </div>
        
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    margin: 0,
    padding: "4rem 2rem",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f9fafb",
    color: "#374151",
    textAlign: "center",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "600px",
    maxWidth: "100%",
    height: "auto",
    marginBottom: "1.5rem",
    cursor: "pointer",
  },
  title: {
    fontSize: "1.75rem",
    marginBottom: "0.5rem",
  },
};

export default ErrorBoundary;
