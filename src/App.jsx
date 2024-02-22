import { useRef, useState, useEffect } from 'react';

function AudioPlayer() {
  const audioInputRef = useRef(null);
  const [playlist, setPlaylist] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [audioIndex, setAudioIndex] = useState(0);

  useEffect(() => {
    // Load last playing audio from localStorage
    const lastPlayingAudio = JSON.parse(localStorage.getItem('lastPlayingAudio'));

    if (lastPlayingAudio) {
      setNowPlaying(lastPlayingAudio);
    }
  }, []);

  useEffect(() => {
    // Save the currently playing audio to localStorage
    localStorage.setItem('lastPlayingAudio', JSON.stringify(nowPlaying));
  }, [nowPlaying]);

  const saveAudio = () => {
    const audioInput = audioInputRef.current;

    if (audioInput.files.length > 0) {
      const audioFile = audioInput.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const audioBlob = new Blob([e.target.result], { type: audioFile.type });
        const audioURL = URL.createObjectURL(audioBlob);

        setPlaylist([...playlist, { url: audioURL, name: audioFile.name }]);

        // If no audio is currently playing, set the first one as now playing
        if (!nowPlaying) {
          setNowPlaying({ url: audioURL, name: audioFile.name });
        }
      };

      reader.readAsArrayBuffer(audioFile);
    } else {
      console.error("No audio file selected");
    }
  };

  const playAudio = (audio, index) => {
    setNowPlaying(audio);
    setAudioIndex(index);
  };

  const handleAudioEnded = () => {
    // Play the next audio in the playlist
    const nextIndex = (audioIndex + 1) % playlist.length;
    setAudioIndex(nextIndex);
    setNowPlaying(playlist[nextIndex]);
  };

  return (
    <div>
      <input
        type="file"
        ref={audioInputRef}
        accept="audio/*"
      />
      <button onClick={saveAudio}>Save Audio</button>

      <div>
        <h2>Playlist</h2>
        <ul>
          {playlist.map((audio, index) => (
            <li key={index} onClick={() => playAudio(audio, index)}>
              {audio.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Now Playing</h2>
        {nowPlaying && (
          <div>
            <p>{nowPlaying.name}</p>
            <audio controls autoPlay src={nowPlaying.url} onEnded={handleAudioEnded} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AudioPlayer;
