import { useEffect, useRef, useState } from 'react';

const musicContainerStyle: React.CSSProperties = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const musicButtonStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  lineHeight: '1',
  padding: '0',
  margin: '0',
  transition: 'all 0.3s ease',
  position: 'relative',
};

const volumeSliderStyle: React.CSSProperties = {
  width: '80px',
  height: '4px',
  borderRadius: '2px',
  background: '#ddd',
  outline: 'none',
  opacity: 0.7,
  transition: 'opacity 0.3s ease',
};

interface BackgroundMusicProps {
  musicSrc: string;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ musicSrc }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.loop = true;
      
      // 오디오 이벤트 리스너 추가
      const handleLoadedData = () => {
        console.log('음악 파일이 로드되었습니다.');
      };
      
      const handleError = (e: any) => {
        console.error('음악 파일 로드 오류:', e);
      };
      
      const handlePlay = () => {
        console.log('음악이 재생되었습니다.');
        setIsPlaying(true);
      };
      
      const handlePause = () => {
        console.log('음악이 일시정지되었습니다.');
        setIsPlaying(false);
      };
      
      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('error', handleError);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      
      return () => {
        audio.removeEventListener('loadeddata', handleLoadedData);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [volume]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (audio) {
      try {
        if (isPlaying) {
          audio.pause();
        } else {
          await audio.play();
        }
      } catch (error) {
        console.error('음악 재생 오류:', error);
        // 사용자 상호작용이 필요한 경우를 위한 폴백
        if (error instanceof Error && error.name === 'NotAllowedError') {
          alert('음악 재생을 위해 화면을 클릭해주세요.');
        }
      }
    }
  };

  const toggleMute = async () => {
    const audio = audioRef.current;
    if (audio) {
      if (isMuted) {
        audio.volume = volume;
        setIsMuted(false);
        if (!isPlaying) {
          try {
            await audio.play();
          } catch (error) {
            console.error('음악 재생 오류:', error);
          }
        }
      } else {
        audio.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      <audio ref={audioRef} src={musicSrc} preload="auto" />
      <div style={musicContainerStyle}>
        <button 
          style={musicButtonStyle}
          onClick={togglePlayPause}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
        >
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            fontSize: '18px',
            lineHeight: '1'
          }}>
            {isPlaying ? '⏸️' : '▶️'}
          </span>
        </button>
        <button 
          style={musicButtonStyle}
          onClick={toggleMute}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
        >
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            fontSize: '18px',
            lineHeight: '1'
          }}>
            {isMuted ? '🔇' : '🔊'}
          </span>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          style={volumeSliderStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
        />
      </div>
    </>
  );
};

export default BackgroundMusic;
