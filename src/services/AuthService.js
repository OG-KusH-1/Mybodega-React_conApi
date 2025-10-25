class AuthService {
  constructor() {
    this.user = { username: "admin", password: "admin" };
  }

  login(username, password) {
    if (username === this.user.username && password === this.user.password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(this.user));
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  isAuthenticated() {
    // ✅ Cambiar para que busque isLoggedIn
    return localStorage.getItem("isLoggedIn") === "true";
  }
}

export default new AuthService();