import { Component } from "react";
import { Result, Button } from "antd";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle={this.state.error?.message || "An unexpected error occurred"}
          extra={[
            <Button type="primary" key="reload" onClick={this.handleReload}>
              Reload Page
            </Button>,
            <Button key="home" onClick={() => window.location.href = "/"}>
              Go Home
            </Button>,
          ]}
        />
      );
    }

    return this.props.children;
  }
}
