import React, { useEffect, useState } from 'react';
import './Confetti.css';

const Confetti = ({ trigger, onComplete }) => {
  const [pieces, setPieces] = useState([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      // Generate confetti pieces
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: `${trigger}-${i}`,
        left: Math.random() * 100,
        animationDelay: Math.random() * 0.3,
        animationDuration: 1.5 + Math.random() * 0.8,
        color: getRandomColor(),
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 6,
        shape: Math.random() > 0.5 ? 'square' : 'circle',
      }));

      setPieces(newPieces);
      setIsActive(true);

      // Clear confetti after animation completes
      const timer = setTimeout(() => {
        setIsActive(false);
        setPieces([]);
        if (onComplete) onComplete();
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  const getRandomColor = () => {
    const colors = [
      '#667eea', // Primary purple
      '#764ba2', // Secondary purple
      '#f093fb', // Pink
      '#4facfe', // Blue
      '#43e97b', // Green
      '#fa709a', // Rose
      '#fee140', // Yellow
      '#30cfd0', // Cyan
      '#a8edea', // Light cyan
      '#ff6b6b', // Red
      '#feca57', // Orange
      '#48dbfb', // Sky blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!isActive || pieces.length === 0) {
    return null;
  }

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`confetti-piece confetti-${piece.shape}`}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.animationDelay}s`,
            animationDuration: `${piece.animationDuration}s`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
