import { useState } from 'react';

const useForm = (initialState = {}) => {
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const resetForm = () => {
        setFormData(initialState);
    };

    const setForm = (newData) => {
        setFormData(newData);
    };

    return {
        formData,
        handleChange,
        resetForm,
        setForm
    };
};

export default useForm;