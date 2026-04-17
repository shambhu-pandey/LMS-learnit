import React, { useMemo, useRef, useState } from "react";
import { FaExpand, FaPlay } from "react-icons/fa";
import "../styles/EnhancedVideoPlayer.css";

const EnhancedVideoPlayer = ({ videoUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef(null);

  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);
  const thumbnailUrl = useMemo(() => {
    if (!videoId) return "";
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }, [videoId]);
  const embedUrl = useMemo(() => {
    if (!videoId) return "";
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  }, [videoId]);

  const handleFullscreenToggle = async () => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (container.requestFullscreen) {
      await container.requestFullscreen();
    }
  };

  if (!videoId) {
    return (
      <div className="video-error">
        <p>Invalid or missing YouTube video URL.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="video-container">
      {!isPlaying ? (
        <button
          type="button"
          className="video-preview"
          onClick={() => setIsPlaying(true)}
        >
          <img src={thumbnailUrl} alt={title} className="thumbnail" />
          <div className="preview-overlay">
            <div className="play-button">
              <FaPlay />
              <span>Play lecture</span>
            </div>
            <h3 className="video-title">{title}</h3>
          </div>
        </button>
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
            <button type="button" onClick={handleFullscreenToggle}>
              <FaExpand />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoPlayer;
