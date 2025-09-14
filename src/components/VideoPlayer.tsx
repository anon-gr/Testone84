import React, { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  channel: any;
  onClose: () => void;
}

export function VideoPlayer({ channel, onClose }: VideoPlayerProps) {
  // Start with lowest quality by default to help users with slow internet
  const getDefaultQuality = () => {
    if (!channel.qualities || channel.qualities.length === 0) return 0;
    
    // Find the lowest quality (SD/480p) first
    const lowQualityIndex = channel.qualities.findIndex((q: any) => 
      q.resolution.includes('480') || q.resolution.includes('SD')
    );
    
    // If no low quality found, find HD/720p
    if (lowQualityIndex === -1) {
      const mediumQualityIndex = channel.qualities.findIndex((q: any) => 
        q.resolution.includes('720') || q.resolution.includes('HD')
      );
      return mediumQualityIndex !== -1 ? mediumQualityIndex : 0;
    }
    
    return lowQualityIndex;
  };

  const [selectedQuality, setSelectedQuality] = useState(getDefaultQuality());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Initialize HLS player
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const currentQuality = channel.qualities[selectedQuality];
    const streamUrl = currentQuality?.url || channel.streamUrl;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    // Check if the stream is HLS (.m3u8)
    if (streamUrl.includes('.m3u8') || streamUrl.includes('m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        
        hlsRef.current = hls;
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play().catch(console.error);
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            setError('خطأ في تحميل البث المباشر');
            setIsLoading(false);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS support
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          video.play().catch(console.error);
        });
        video.addEventListener('error', () => {
          setError('خطأ في تحميل البث المباشر');
          setIsLoading(false);
        });
      } else {
        setError('المتصفح لا يدعم تشغيل البث المباشر');
        setIsLoading(false);
      }
    } else {
      // Regular video file
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().catch(console.error);
      });
      video.addEventListener('error', () => {
        setError('خطأ في تحميل الفيديو');
        setIsLoading(false);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel, selectedQuality]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, onClose]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const currentQuality = channel.qualities[selectedQuality];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div 
        ref={containerRef}
        className="relative w-full max-w-6xl h-full max-h-[90vh] flex flex-col bg-black rounded-lg overflow-hidden shadow-2xl"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            controls={false}
            className="w-full h-full object-contain"
          />

          {/* Loading/Error Overlay */}
          {(isLoading || error) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                {isLoading && (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
                    <p className="text-white">جاري تحميل البث...</p>
                    {channel.qualities && channel.qualities.length > 1 && (
                      <p className="text-gray-300 text-sm mt-2">
                        💡 نصيحة: إذا كان التحميل بطيئاً، اختر جودة أقل من زر الجودة
                      </p>
                    )}
                  </>
                )}
                {error && (
                  <>
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-red-400">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      إعادة المحاولة
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 
          transition-opacity duration-300 pointer-events-none
          ${showControls ? 'opacity-100' : 'opacity-0'}
        `}>
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 pointer-events-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="text-white">
                  <h2 className="text-xl font-bold">{channel.name}</h2>
                  {channel.description && (
                    <p className="text-sm text-gray-300">{channel.description}</p>
                  )}
                </div>
              </div>

              {/* Quality Selector */}
              {channel.qualities.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">الجودة:</span>
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(Number(e.target.value))}
                    className="bg-black/50 text-white rounded px-3 py-1 text-sm border border-gray-600 focus:border-blue-500 outline-none"
                  >
                    {channel.qualities.map((quality: any, index: number) => (
                      <option key={index} value={index}>
                        {quality.label} ({quality.resolution})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (videoRef.current.paused) {
                        videoRef.current.play();
                      } else {
                        videoRef.current.pause();
                      }
                    }
                  }}
                  className="p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5-8-5z" />
                  </svg>
                </button>

                <div className="text-white text-sm">
                  <span className="bg-red-500 px-2 py-1 rounded text-xs font-medium">
                    مباشر
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Quality Selector Button */}
                {channel.qualities.length > 1 && (
                  <div className="relative group">
                    <button
                      className="p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors flex items-center gap-2"
                      title="اختيار جودة البث - اختر جودة منخفضة للاتصال الضعيف"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <div className="flex flex-col items-start">
                        <span className="text-white text-xs font-medium">{currentQuality?.label || 'HD'}</span>
                        <span className="text-gray-300 text-xs">{currentQuality?.resolution || '720p'}</span>
                      </div>
                    </button>
                    
                    {/* Quality Dropdown */}
                    <div className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[160px] border border-gray-600">
                      <div className="p-2 border-b border-gray-600">
                        <p className="text-xs text-gray-300 text-center">اختر الجودة المناسبة لاتصالك</p>
                      </div>
                      {channel.qualities.map((quality: any, index: number) => {
                        const isLowQuality = quality.resolution.includes('480') || quality.resolution.includes('SD');
                        const isMediumQuality = quality.resolution.includes('720') || quality.resolution.includes('HD');
                        const isHighQuality = quality.resolution.includes('1080') || quality.resolution.includes('FHD');
                        const isVeryHighQuality = quality.resolution.includes('4K') || quality.resolution.includes('2160');
                        
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedQuality(index)}
                            className={`w-full text-right px-3 py-2 text-sm hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center justify-between ${
                              selectedQuality === index ? 'bg-blue-600 text-white' : 'text-white'
                            }`}
                          >
                            <div className="flex flex-col items-end">
                              <span className="font-medium">{quality.label}</span>
                              <span className="text-xs opacity-75">{quality.resolution}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {isLowQuality && (
                                <span className="text-xs bg-green-500 text-white px-1 py-0.5 rounded text-[10px]">
                                  سريع
                                </span>
                              )}
                              {isMediumQuality && (
                                <span className="text-xs bg-yellow-500 text-white px-1 py-0.5 rounded text-[10px]">
                                  متوسط
                                </span>
                              )}
                              {isHighQuality && (
                                <span className="text-xs bg-orange-500 text-white px-1 py-0.5 rounded text-[10px]">
                                  عالي
                                </span>
                              )}
                              {isVeryHighQuality && (
                                <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded text-[10px]">
                                  عالي جداً
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
                  title={isFullscreen ? 'خروج من ملء الشاشة' : 'ملء الشاشة'}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isFullscreen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
