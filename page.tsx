"use client";
import { useRef, useState, useEffect } from "react";

function Home() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const videoRef = useRef(null);

  const configCurrentTime = (time) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
    setCurrentTime(time);
  };

  const playPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleVolumeChange = (newVolume) => {
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);
      
      // Se o volume for maior que 0, automaticamente desmuta o vídeo
      if (newVolume > 0 && muted) {
        setMuted(false);
        video.muted = false;
      }
      
      // Se o volume for 0, automaticamente muta o vídeo
      if (newVolume === 0 && !muted) {
        setMuted(true);
        video.muted = true;
      }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (muted) {
      // Desmutar o vídeo
      video.muted = false;
      setMuted(false);
      // Restaurar volume anterior (se era 0, definir para 0.5)
      const volumeToRestore = previousVolume > 0 ? previousVolume : 0.5;
      video.volume = volumeToRestore;
      setVolume(volumeToRestore);
    } else {
      // Mutar o vídeo completamente
      video.muted = true;
      setMuted(true);
      // Salvar volume atual antes de mutar
      setPreviousVolume(volume);
    }
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.min(video.duration || 0, video.currentTime + 10);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.max(0, video.currentTime - 10);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const increaseVolume = () => {
    const newVolume = Math.min(1, volume + 0.1);
    handleVolumeChange(newVolume);
  };

  const decreaseVolume = () => {
    const newVolume = Math.max(0, volume - 0.1);
    handleVolumeChange(newVolume);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(1, '0')}`;
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-[#FFFF00] flex justify-center items-center">
      <div className="w-[30vw] h-[80vh] bg-[rgb(255,255,240)] p-0">
        <div className="flex justify-center m-1">
          <video 
            ref={videoRef}
            className="w-[110%] h-75 bg-borange"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            controls={false}
          >



mkdir ufersa
            {/* Exemplo de vídeo - você pode trocar por qualquer URL de vídeo */}
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            Seu navegador não suporta vídeo HTML5.
          </video>
        </div>
        
        <div className="flex justify-center items-center space-x-3 mt-6">
          <button 
            onClick={skipBackward}
            className="text-black cursor-pointer text-lg hover:text-gray-600"
            title="Voltar 10 segundos"
            className="text-black cursor-pointer text-xl bg-black-300 rounded-full p-2 hover:bg-red-400"
          >
            ⏪
          </button>
          
          {/* Botão exclusivo para PLAY */}
          <button 
            onClick={() => {
              const video = videoRef.current;
              if (video && !playing) {
                video.play();
                setPlaying(true);
              }
            }}
            className="text-black cursor-pointer text-xl bg-black-300 rounded-full p-2 hover:bg-green-400"
            disabled={playing}
          >
            ▶️
          </button>
          
          {/* Botão exclusivo para PAUSE */}
          <button 
            onClick={() => {
              const video = videoRef.current;
              if (video && playing) {
                video.pause();
                setPlaying(false);
              }
            }}
            className="text-black cursor-pointer text-xl bg-black-300 rounded-full p-2 hover:bg-green-400"
            disabled={!playing}
          >
            ⏸️
          </button>
          
          <button 
            onClick={skipForward}
            className="text-black cursor-pointer text-lg hover:text-gray-600"
            title="Avançar 10 segundos"
            className="text-black cursor-pointer text-xl bg-black-300 rounded-full p-2 hover:bg-red-400"
          >
            ⏩
          </button>
        </div>
        
        {/* Slider de progresso */}
        <input 
          className="w-[100%] mt-4" 
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={(e) => configCurrentTime(Number(e.target.value))}
        />
        
        {/* Controle de volume com botões e mute */}
        <div className="flex items-center mt-2 space-x-2">
          <button 
            onClick={toggleMute}
            className="text-black cursor-pointer text-sm hover:text-gray-600"
            title={muted ? "Desmutar vídeo" : "Mutar vídeo"}
             className="text-black cursor-pointer text-xl bg-black-300 rounded-full p-2 hover:bg-blue-400"
          >
            {muted ? "🔇" : "🔊"}
          </button>
          
          <button 
            onClick={decreaseVolume}
            className="text-black cursor-pointer text-sm hover:text-gray-600"
            title="Diminuir volume"
          >
            🔉
          </button>
          
          <input 
            className="w-20" 
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={muted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            title="Controle de volume"
          />
          
          <button 
            onClick={increaseVolume}
            className="text-black cursor-pointer text-sm hover:text-gray-600"
            title="Aumentar volume"
            className="text-black cursor-pointer text-xl bg-black-300 rounded-full p-2 hover:bg-blue-400"
          >
            🔊
          </button>
          
          <span className="text-black text-xs">{muted ? "0%" : Math.round(volume * 100) + "%"}</span>
        </div>
        
        {/* Indicadores de tempo */}
        <div className="flex justify-between text-sm text-black mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 0)}</span>
        </div>
      </div>
    </div>
  );
}

export default Home;

