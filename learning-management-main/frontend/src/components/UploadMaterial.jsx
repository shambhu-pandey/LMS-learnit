
import React, { useState } from 'react';
import axios from '../api/axios';

const UploadMaterial = ({ courseId }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`/courses/${courseId}/materials`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Material uploaded successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to upload material');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadMaterial;





