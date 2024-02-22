import { useRef, useState, useEffect } from 'react';

function AudioPlayer() {
    const audioInputRef = useRef(null);
    const audioRef = useRef(null);
    const [playlist, setPlaylist] = useState([]);
    const [nowPlaying, setNowPlaying] = useState(null);
    const [audioIndex, setAudioIndex] = useState(0);
    const [audioPosition, setAudioPosition] = useState(0);

    useEffect(() => {
        const lastPlayingAudio = JSON.parse(localStorage.getItem('lastPlayingAudio'));
        const lastPlayedAudioPosition = JSON.parse(localStorage.getItem('audioPosition'));

        if (lastPlayingAudio) {
            setNowPlaying(lastPlayingAudio);
            setAudioPosition(lastPlayedAudioPosition);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('lastPlayingAudio', JSON.stringify(nowPlaying));
        const audioNow = audioRef.current;
        if (audioNow) {
            audioNow.currentTime = audioPosition;
        }
    }, [nowPlaying]);

    useEffect(() => {
        localStorage.setItem('audioPosition', JSON.stringify(audioPosition));
    }, [audioPosition]);

    const saveAudio = () => {
        const audioInput = audioInputRef.current;

        if (audioInput.files.length > 0) {
            const audioFile = audioInput.files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                const audioBlob = new Blob([e.target.result], { type: audioFile.type });
                const audioURL = URL.createObjectURL(audioBlob);

                setPlaylist([...playlist, { url: audioURL, name: audioFile.name }]);

                if (!nowPlaying) {
                    setNowPlaying({ url: audioURL, name: audioFile.name });
                }
            };

            reader.readAsArrayBuffer(audioFile);
        } else {
            alert("No audio file selected");
        }
    };

    const playAudio = (audio, index) => {
        setNowPlaying(audio);
        setAudioIndex(index);
    };

    const handleAudioEnded = () => {
        const nextIndex = (audioIndex + 1) % playlist.length;
        setAudioIndex(nextIndex);
        setNowPlaying(playlist[nextIndex]);
    };

    return (
        <div>
            <h1>Music Player App</h1>
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
                        <audio ref={audioRef} controls autoPlay src={nowPlaying.url} onEnded={handleAudioEnded} onTimeUpdate={(e) => setAudioPosition(e.target.currentTime)} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AudioPlayer;
