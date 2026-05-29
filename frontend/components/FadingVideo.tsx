import { useEffect, useRef } from "react";

interface FadingVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

function FadingVideo({ src, className, style }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);

  const fadeTo = (targetOpacity: number, durationMs: number) => {
    const video = videoRef.current;
    if (!video) return;

    // Cancel any ongoing animation frame
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    const currentOpacity = parseFloat(video.style.opacity) || 0;
    const opacityDiff = targetOpacity - currentOpacity;
    if (opacityDiff === 0) return;

    const startTime = performance.now();

    const animate = (currentTimeMs: number) => {
      const elapsed = currentTimeMs - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Calculate and apply new opacity
      const newOpacity = currentOpacity + opacityDiff * progress;
      video.style.opacity = newOpacity.toString();

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial opacity to 0
    video.style.opacity = "0";

    const handleLoadedData = () => {
      video.style.opacity = "0";
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay was prevented, waiting for user interaction:", error);
        });
      }
      fadeTo(1, 500);
    };

    const handleTimeUpdate = () => {
      const duration = video.duration;
      const currentTime = video.currentTime;

      if (!duration || isNaN(duration)) return;

      const timeLeft = duration - currentTime;

      // Start fade out at 0.55s before end if not already fading
      if (!fadingOutRef.current && timeLeft <= 0.55 && timeLeft > 0) {
        fadingOutRef.current = true;
        fadeTo(0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        if (!videoRef.current) return;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => console.warn("Replay failed:", err));
        }
        fadingOutRef.current = false;
        fadeTo(1, 500);
      }, 100);
    };

    // Attach event listeners
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    // If video is already loaded (from browser cache), trigger manually
    if (video.readyState >= 3) {
      handleLoadedData();
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{ ...style, transition: "none" }} /* Ensure no CSS transitions */
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}

export default FadingVideo;
