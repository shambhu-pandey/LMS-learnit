
import React, { useState } from 'react';
import axios from '../api/axios';

const UploadMaterial = ({ courseId }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile && !title) {
            setTitle(selectedFile.name);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title || file.name);

        try {
            await axios.post(`/api/courses/${courseId}/materials`, formData, {
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
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Material title"
            />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadMaterial;





