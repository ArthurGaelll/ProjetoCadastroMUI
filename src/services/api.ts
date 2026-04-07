import axios from 'axios'

const api = axios.create({
    baseURL: 'https://localhost:7151'
})

export default api