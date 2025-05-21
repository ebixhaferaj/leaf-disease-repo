import axios from 'axios'

export default axios.create({
    baseURL: 'http://localhost:8000' // FastAPI backend
    // withCredentials: true,            // Optional, if you're using cookies
  });