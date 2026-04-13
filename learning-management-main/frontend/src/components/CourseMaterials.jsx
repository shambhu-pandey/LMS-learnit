


// // filepath: c:\Users\shamb\OneDrive\Desktop\capstone-project-main\pro\capstone-project-main\frontend\src\components\CourseMaterials.jsx
// import React, { useState, useEffect } from "react";
// import axios from "../api/axios";
// import { toast } from "react-toastify";
// import { useParams } from 'react-router-dom';
// import ViewMaterials from '../components/ViewMaterials';

// const CourseMaterials = () => {
//   const [materials, setMaterials] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState("");

//   useEffect(() => {
//     fetchMaterials();
//   }, []);


//   const fetchMaterials = async () => {
//     try {
//       const response = await axios.get("/api/courses/materials");
//       if (response.data.success) {
//         setMaterials(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching materials:", error);
//       toast.error("Failed to fetch materials");
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setTitle(selectedFile.name);
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       toast.error("Please select a file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", title);

//     setUploading(true);
//     try {
//       const response = await axios.post("/api/courses/materials", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.data.success) {
//         toast.success("Material uploaded successfully");
//         setFile(null);
//         setTitle("");
//         fetchMaterials();
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       toast.error("Failed to upload material");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Upload Materials</h2>
//       <form onSubmit={handleUpload} className="mb-6 p-4 bg-gray-50 rounded-lg">
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">Upload Material</label>
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg"
//             placeholder="Enter material title"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={uploading}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//         >
//           {uploading ? "Uploading..." : "Upload Material"}
//         </button>
//       </form>

//       <div className="space-y-4">
//         {materials.map((material) => (
//           <div key={material._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
//             <div>
//               <h3 className="font-medium">{material.title}</h3>
//               <p className="text-sm text-gray-500">
//                 Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}
//               </p>
//             </div>
//             <a
//               href={material.fileUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//             >
//               View
//             </a>
//           </div>
//         ))}
//         {materials.length === 0 && (
//           <p className="text-center text-gray-500">No materials uploaded yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseMaterials;



import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const CourseMaterials = () => {
  const { courseId } = useParams(); // Get courseId from the route
  const [materials, setMaterials] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, [courseId]); // Only run when courseId changes

  const fetchMaterials = async () => {
    console.log("Fetching materials for courseId:", courseId); // Debugging
    try {
      const response = await axios.get(`/courses/${courseId}/materials`);
      if (response.data.success) {
        setMaterials(response.data.materials);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast.error("Failed to fetch materials");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTitle(selectedFile.name);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    setUploading(true);
    try {
      const response = await axios.post(`/courses/${courseId}/materials`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Material uploaded successfully");
        setFile(null);
        setTitle("");
        fetchMaterials();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload material");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Materials</h2>
      <form onSubmit={handleUpload} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Upload Material</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter material title"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Upload Material"}
        </button>
      </form>

      <div className="space-y-4">
        {materials.map((material) => (
          <div key={material._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div>
              <h3 className="font-medium">{material.title}</h3>
              <p className="text-sm text-gray-500">
                Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <a
              href={`http://localhost:5000/${material.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              View
            </a>
          </div>
        ))}
        {materials.length === 0 && (
          <p className="text-center text-gray-500">No materials uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseMaterials;