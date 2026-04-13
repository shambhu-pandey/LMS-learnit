import React, { useState } from 'react';
import { FaPlay, FaPause, FaExpand, FaCompress } from 'react-icons/fa';
import '../styles/EnhancedVideoPlayer.css';

const EnhancedVideoPlayer = ({ videoUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleFullscreenToggle = () => {
    const videoContainer = document.querySelector('.video-container');
    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`video-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {!isPlaying ? (
        <div className="video-preview" onClick={handlePlayClick}>
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="thumbnail"
          />
          <div className="preview-overlay">
            <div className="play-button">
              <FaPlay />
              <span>Play Lecture</span>
            </div>
            <h3 className="video-title">{title}</h3>
          </div>
        </div>
      ) : (
        <div className="video-wrapper">
          <iframe
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="video-controls">
            <button onClick={handleFullscreenToggle}>
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoPlayer;














// import React, { useState, useEffect } from 'react';
// import { FaPlay, FaPause, FaExpand, FaCompress, FaExclamationTriangle } from 'react-icons/fa';
// import '../styles/EnhancedVideoPlayer.css';

// const EnhancedVideoPlayer = ({ videoUrl, title }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [error, setError] = useState(null);
//   const [embedUrl, setEmbedUrl] = useState('');

//   useEffect(() => {
//     try {
//       if (!videoUrl) {
//         throw new Error('No video URL provided');
//       }
//       const videoId = getYouTubeId(videoUrl);
//       if (!videoId) {
//         throw new Error('Invalid YouTube URL');
//       }
//       // Create an embed URL with additional parameters for better playback
//       setEmbedUrl(`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&autoplay=0&rel=0&modestbranding=1`);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Video URL Error:', err);
//     }
//   }, [videoUrl]);

//   const getYouTubeId = (url) => {
//     if (!url) return null;
    
//     // Handle different YouTube URL formats
//     const patterns = [
//       /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
//       /^([^"&?\/\s]{11})$/i
//     ];

//     for (const pattern of patterns) {
//       const match = url.match(pattern);
//       if (match) return match[1];
//     }
//     return null;
//   };

//   const handlePlayClick = () => {
//     if (!error) {
//       setIsPlaying(true);
//     }
//   };

//   const handleFullscreenToggle = () => {
//     const videoContainer = document.querySelector('.video-container');
    
//     if (!document.fullscreenElement) {
//       if (videoContainer.requestFullscreen) {
//         videoContainer.requestFullscreen();
//       } else if (videoContainer.webkitRequestFullscreen) {
//         videoContainer.webkitRequestFullscreen();
//       } else if (videoContainer.msRequestFullscreen) {
//         videoContainer.msRequestFullscreen();
//       }
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       } else if (document.webkitExitFullscreen) {
//         document.webkitExitFullscreen();
//       } else if (document.msExitFullscreen) {
//         document.msExitFullscreen();
//       }
//     }
//   };

//   if (error) {
//     return (
//       <div className="video-error">
//         <FaExclamationTriangle />
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className={`video-container ${isFullscreen ? 'fullscreen' : ''}`}>
//       {!isPlaying ? (
//         <div className="video-preview" onClick={handlePlayClick}>
//           <img 
//             src={`https://img.youtube.com/vi/${getYouTubeId(videoUrl)}/maxresdefault.jpg`}
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = `https://img.youtube.com/vi/${getYouTubeId(videoUrl)}/0.jpg`;
//             }}
//             alt={title || 'Video thumbnail'}
//             className="thumbnail"
//           />
//           <div className="preview-overlay">
//             <div className="play-button">
//               <FaPlay />
//               <span>Play Video</span>
//             </div>
//             {title && <h3 className="video-title">{title}</h3>}
//           </div>
//         </div>
//       ) : (
//         <div className="video-wrapper">
//           <iframe
//             src={embedUrl}
//             title={title || 'Video'}
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           />
//           <div className="video-controls">
//             <button 
//               onClick={handleFullscreenToggle}
//               className="fullscreen-toggle"
//               title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
//             >
//               {isFullscreen ? <FaCompress /> : <FaExpand />}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EnhancedVideoPlayer;