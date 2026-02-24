// Synchronous database status manager
class DatabaseStatus {
  constructor() {
    this.initialized = false;
    this.error = null;
    this.listeners = new Set();
  }

  setStatus(initialized, error = null) {
    this.initialized = initialized;
    this.error = error;
    this.notifyListeners();
  }

  addListener(listener) {
    this.listeners.add(listener);
    // Immediately notify new listener of current status
    listener(this.initialized, this.error);
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => {
      listener(this.initialized, this.error);
    });
  }

  getStatus() {
    return {
      initialized: this.initialized,
      error: this.error
    };
  }
}

// Create a singleton instance
const databaseStatus = new DatabaseStatus();

export default databaseStatus; 