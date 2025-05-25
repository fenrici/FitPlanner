import { useState, useEffect } from 'react';
import api from '../services/api';

const useFetch = (url) => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(url);
                setResult(response.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(err.response?.data?.message || 'Error al cargar datos');
                setLoading(false);
            }
        };

        if (url) {
            fetchData();
        }
    }, [url]);
    
    return { loading, result, error };
};

export default useFetch;