import React from "react";
import styled from "styled-components";
import { ApolloError } from "@apollo/client";

const ErrorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-bottom: 1px solid #f5c6cb;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ErrorMessage = styled.div`
  flex: 1;
`;

const ErrorTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: bold;
`;

const ErrorDetails = styled.p`
  margin: 0;
  font-size: 14px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #721c24;
  margin-left: 15px;
`;

interface ErrorNotificationProps {
  error: ApolloError | Error;
  onDismiss?: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onDismiss,
}) => {
  // Determine if it's a network error
  const isNetworkError =
    error.message.includes("Network error") ||
    error.message.includes("Failed to fetch") ||
    (error instanceof ApolloError && error.networkError);

  const title = isNetworkError ? "Connection Error" : "Error";
  const message = isNetworkError
    ? "Unable to connect to the server. Please check your connection or try again later."
    : error.message;

  return (
    <ErrorContainer>
      <ErrorMessage>
        <ErrorTitle>{title}</ErrorTitle>
        <ErrorDetails>{message}</ErrorDetails>
      </ErrorMessage>
      {onDismiss && <CloseButton onClick={onDismiss}>&times;</CloseButton>}
    </ErrorContainer>
  );
};
