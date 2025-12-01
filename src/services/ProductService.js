import axios from "axios";
import AuthService from "./AuthService";

const API_URL = "http://localhost:8090/api/products";

class ProductService {

  getHeaders() {
    const token = AuthService.getToken();
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async getAll() {
    const response = await axios.get(API_URL, this.getHeaders());
    return response.data;
  }

  async create(producto) {
    const response = await axios.post(API_URL, producto, this.getHeaders());
    return response.data;
  }

  async update(id, producto) {
    const response = await axios.put(`${API_URL}/${id}`, producto, this.getHeaders());
    return response.data;
  }

  async delete(id) {
    const response = await axios.delete(`${API_URL}/${id}`, this.getHeaders());
    return response.data;
  }
}

export default new ProductService();