import styles from '@/styles/Sidebar.module.css';
export default function Connectspotify (){
    const handleConnect = ()=>{
        const clientId = '9ae550479915439097e1d643ee6caa79';
        const redirectUri = encodeURIComponent('http://localhost:3000/callback');
        const scopes = encodeURIComponent('user-read-playback-state user-modify-playback-state user-read-currently-playing streaming');
        const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
        window.location.href = spotifyAuthUrl;
    }
    return(
        <button onClick={handleConnect} className={styles.spotifyButton}>
           <img src="/spotify.png" width={40} height={40}/>
        </button>
    )
}