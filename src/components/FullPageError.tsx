import React from "react";
import styled from "styled-components";
import { ApolloError } from "@apollo/client";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: #dc3545;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #343a40;
`;

const ErrorMessage = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  color: #6c757d;
  max-width: 500px;
`;

const RetryButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

interface FullPageErrorProps {
  error: ApolloError | Error;
  onRetry?: () => void;
}

export const FullPageError: React.FC<FullPageErrorProps> = ({
  error,
  onRetry,
}) => {
  // Determine if it's a network error
  const isNetworkError =
    error.message.includes("Network error") ||
    error.message.includes("Failed to fetch") ||
    (error instanceof ApolloError && error.networkError);

  const title = isNetworkError ? "Connection Error" : "Something went wrong";

  const message = isNetworkError
    ? "Unable to connect to the scanner server. Please check that the server is running and try again."
    : error.message;

  return (
    <ErrorContainer>
      <ErrorIcon>{isNetworkError ? "🔌" : "⚠️"}</ErrorIcon>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
      {onRetry && <RetryButton onClick={onRetry}>Try Again</RetryButton>}
    </ErrorContainer>
  );
};
