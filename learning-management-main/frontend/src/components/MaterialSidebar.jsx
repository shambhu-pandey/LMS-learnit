// import React, { useState } from 'react';
// import { FaCloudUploadAlt, FaFile, FaDownload } from 'react-icons/fa';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import '../styles/MaterialSidebar.css';

// const MaterialSidebar = ({ courseId, isInstructor, materials, onUpload }) => {
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('title', title || file.name);

//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `/api/courses/${courseId}/materials`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
//       toast.success('Material uploaded successfully');
//       setFile(null);
//       setTitle('');
//       if (onUpload) onUpload(response.data);
//     } catch (error) {
//       toast.error('Upload failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="material-sidebar">
//       <h3>Course Materials</h3>
      
//       {isInstructor && (
//         <form onSubmit={handleUpload} className="upload-form">
//           <div className="form-group">
//             <label>Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Material title"
//             />
//           </div>
//           <div className="form-group">
//             <label>File</label>
//             <input
//               type="file"
//               onChange={(e) => setFile(e.target.files[0])}
//               accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
//             />
//           </div>
//           <button type="submit" disabled={loading || !file}>
//             {loading ? 'Uploading...' : 'Upload Material'}
//             <FaCloudUploadAlt />
//           </button>
//         </form>
//       )}

//       <div className="materials-list">
//         {materials?.map((material) => (
//           <div key={material._id} className="material-item">
//             <div className="material-info">
//               <FaFile className="file-icon" />
//               <span>{material.title}</span>
//             </div>
//             <a 
//               href={material.fileUrl} 
//               download
//               className="download-btn"
//             >
//               <FaDownload />
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MaterialSidebar;





import React from 'react';
import { FaFile } from 'react-icons/fa';

const MaterialSidebar = ({ materials }) => {
  return (
    <div className="material-sidebar">
      <h3>Course Materials</h3>
      <div className="materials-list">
        {materials.map((material) => (
          <div key={material._id} className="material-item">
            <div className="material-info">
              <FaFile className="file-icon" />
              <span>{material.title}</span>
            </div>
            <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="download-btn">
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialSidebar;