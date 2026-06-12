"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
	children?: ReactNode;
	fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
	}

	private resetErrorBoundary = () => {
		this.setState({ hasError: false, error: null });
	};

	public render() {
		if (this.state.hasError && this.state.error) {
			if (typeof this.props.fallback === "function") {
				return this.props.fallback(this.state.error, this.resetErrorBoundary);
			}
			return this.props.fallback;
		}

		return this.props.children;
	}
}
