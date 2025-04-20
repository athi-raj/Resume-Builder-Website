
import React, { useEffect, useRef } from 'react';

interface AnimatedGradientProps {
  className?: string;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match parent element
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };
    
    // Call once to initialize
    resizeCanvas();
    
    // Update on resize
    window.addEventListener('resize', resizeCanvas);
    
    // Blob parameters
    const blobs = [
      { x: 0.3, y: 0.3, radius: 0.15, color: 'rgba(59, 130, 246, 0.2)', vx: 0.001, vy: 0.0007 },
      { x: 0.7, y: 0.7, radius: 0.15, color: 'rgba(59, 130, 246, 0.15)', vx: -0.0008, vy: -0.0009 },
      { x: 0.2, y: 0.8, radius: 0.1, color: 'rgba(99, 102, 241, 0.15)', vx: 0.0007, vy: -0.0005 },
      { x: 0.8, y: 0.2, radius: 0.1, color: 'rgba(139, 92, 246, 0.15)', vx: -0.0005, vy: 0.0008 },
    ];
    
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw blobs
      blobs.forEach(blob => {
        // Update position (normalized coordinates)
        blob.x += blob.vx;
        blob.y += blob.vy;
        
        // Bounce off edges
        if (blob.x < 0 || blob.x > 1) blob.vx = -blob.vx;
        if (blob.y < 0 || blob.y > 1) blob.vy = -blob.vy;
        
        // Convert to pixel coordinates
        const x = blob.x * canvas.width;
        const y = blob.y * canvas.height;
        const radius = blob.radius * Math.min(canvas.width, canvas.height);
        
        // Draw gradient blob
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full -z-10 ${className}`}
    />
  );
};

export default AnimatedGradient;
