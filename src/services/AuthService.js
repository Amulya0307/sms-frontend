import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

class AuthService {

  login(username, password) {
    return axios.post(API_URL + "/login", {
      username,
      password
    }).then(response => {

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
      }

      return response.data;
    });
  }

  logout() {
    localStorage.clear();
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getRole() {
    return localStorage.getItem("role");
  }

  isAdmin() {
    return this.getRole() === "ADMIN";
  }

  isStudent() {
    return this.getRole() === "STUDENT";
  }
}

// ✅ FIX HERE
const authService = new AuthService();
export default authService;