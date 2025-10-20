class AuthService {
  constructor() {
    this.user = { username: "admin", password: "admin" };
  }

  login(username, password) {
    if (username === this.user.username && password === this.user.password) {
      localStorage.setItem("user", JSON.stringify(this.user));
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem("user");
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  isAuthenticated() {
    return !!localStorage.getItem("user");
  }
}

export default new AuthService();
