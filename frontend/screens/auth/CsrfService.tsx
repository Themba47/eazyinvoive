import axios from 'axios';
import { backendApp } from '../utils';

let csrfToken = '';

export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get(`${backendApp()}/api/csrf/`);
        csrfToken = response.data.csrfToken;
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
    }
};

export const getCsrfToken = () => csrfToken;
