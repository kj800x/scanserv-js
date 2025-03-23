import { ScanRoute } from "./ScanRoute";
import { FinalizedGroupsRoute } from "./FinalizedGroupsRoute";
import { NavigationBar } from "./NavigationBar";
import { useState, useEffect } from "react";

function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(
    window.location.pathname
  );

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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NavigationBar
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
      />
      {currentRoute === "/" && <ScanRoute />}
      {currentRoute === "/finalized-groups" && <FinalizedGroupsRoute />}
      {currentRoute !== "/" && currentRoute !== "/finalized-groups" && (
        <div>
          <h1>404 Unexpected Route</h1>
        </div>
      )}
    </div>
  );
}

export default App;
