import constants from "./constants";
import databaseStatus from "./databaseStatus";

// Initialize app state
const initApp = () => {
  // Start the health check
  const checkHealth = () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(`${constants.API_URL}/health`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API server returned ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "ok") {
          databaseStatus.setStatus(true);
        } else {
          throw new Error(data.message || "API server is not healthy");
        }
      })
      .catch((error) => {
        let errorMessage;
        if (error.name === "AbortError") {
          errorMessage =
            "API server timeout - please check if the server is running";
        } else if (
          error.name === "TypeError" &&
          error.message === "Network request failed"
        ) {
          errorMessage =
            "Cannot connect to API server - please check your network connection";
        } else {
          errorMessage = error.message;
        }
        databaseStatus.setStatus(false, errorMessage);
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });
  };

  // Start initial health check
  checkHealth();

  // Set up periodic health checks
  setInterval(checkHealth, 30000); // Check every 30 seconds
};

// Start initialization
initApp();

const appInitializer = {
  getDatabaseStatus: () => databaseStatus.getStatus(),
};

export default appInitializer;
