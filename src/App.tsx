import { ScanPage } from "./ScanPage";
import { EditPage } from "./EditPage";
import { ExportPage } from "./ExportPage";
import { NavigationBar } from "./NavigationBar";
import { useState, useEffect, createContext } from "react";
import { useApolloClient, gql } from "@apollo/client";

// Create a context to share server connection status across components
export const ServerConnectionContext = createContext<boolean>(true);

// Simple query to check server connectivity
const CHECK_CONNECTIVITY = gql`
  query CheckConnectivity {
    __typename
  }
`;

function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(
    window.location.pathname
  );
  const [isServerOnline, setIsServerOnline] = useState<boolean>(true);
  const apolloClient = useApolloClient();

  // Update URL when route changes
  useEffect(() => {
    window.history.pushState({}, "", currentRoute);
  }, [currentRoute]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Check server connection periodically
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        // Send a small query to check if server is reachable
        await apolloClient.query({
          query: CHECK_CONNECTIVITY,
          fetchPolicy: "network-only",
        });
        setIsServerOnline(true);
      } catch (error) {
        setIsServerOnline(false);
      }
    };

    // Initial check
    checkServerConnection();

    // Check every 10 seconds
    const interval = setInterval(checkServerConnection, 10000);
    return () => clearInterval(interval);
  }, [apolloClient]);

  return (
    <ServerConnectionContext.Provider value={isServerOnline}>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <NavigationBar
          currentRoute={currentRoute}
          onRouteChange={setCurrentRoute}
        />
        {currentRoute === "/" && <ScanPage />}
        {currentRoute === "/edit" && <EditPage />}
        {currentRoute === "/export" && <ExportPage />}
        {!["/", "/edit", "/export"].includes(currentRoute) && (
          <div>
            <h1>404 Unexpected Route</h1>
          </div>
        )}
      </div>
    </ServerConnectionContext.Provider>
  );
}

export default App;
