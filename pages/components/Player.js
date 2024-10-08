import { useEffect, useState } from 'react';
import styles from '@/styles/webPlayer.module.css';

import { useAuthContext } from '@/utils/AuthContext';

const Player = () => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [trackData,setTrackData] = useState(null);
  const [accessToken,setAccessToken] = useState(null);
  const {user} = useAuthContext();
  //let accessToken = typeof window !== 'undefined' ? localStorage.getItem('spotifyAccessToken') : "BQASewVRKolpYTiNVk8m1XUDMMmO6BLbCmvbxc8smIxuJQUI8z3X_F1PuxQiH7kxFPRGl1Ceq4aRnQtGkG18hcmMWJ8madPF9u4R_YBkfcT6IKCfbFkCA_6NeTfj2McXeemKiMBO8bP8g191H_v_YZeBfVco-yKAJzT2Ycnn6OcbcfaxWhvt-z0Dg5dva1iwKFfN9DhKadCWRgx3oxVPPGfBIyx-JQ";


  useEffect(()=>{
    const getUserData = async ()=>{
        if(user){
          console.log("trying to fetch user");
          let response = await fetch(`/api/getuser?userUID=${user.uid}`);
          if(response.ok){
            let userData = await response.json();
          
            console.log(userData.user.spotify_access);
            setAccessToken(userData.user.spotify_access);
          }
        }
      }
      getUserData();
},[]);

  useEffect(() => {

  
    if (accessToken) {

    
   
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new Spotify.Player({
          name: 'Next.js Spotify Player',
          getOAuthToken: cb => { cb(accessToken); },
          volume: 0.5
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          localStorage.setItem('deviceID',device_id);
          console.log("localValue" + " " + localStorage.getItem('deviceID'));
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        spotifyPlayer.addListener('initialization_error', ({ message }) => {
           console.error('Failed to initialize', message);
        });

        spotifyPlayer.addListener('authentication_error', ({ message }) => {
          // console.log("error happening");
          // console.error('Failed to authenticate', message);
        });

        spotifyPlayer.addListener('account_error', ({ message }) => {
          console.error('Failed to validate Spotify account', message);
        });

        spotifyPlayer.addListener('playback_error', ({ message }) => {
          console.error('Failed to perform playback', message);
        });


        // spotifyPlayer.addListener('player_state_changed', state => {
        //   console.log('changed' + state)
        //   if (state) {
        //     const currentTrack = state.track_window.current_track;
        //     console.log('Currently Playing:', currentTrack);
          
        //     if ( currentTrack.album.images.length >= 1){
        //         const albumArt = currentTrack.album.images[0].url; // Album art URL
        //         const trackName = currentTrack.name; // Track name
        //         const artistName = currentTrack.artists.map(artist => artist.name).join(', '); // Artist name(s)
        //         console.log('Album Art:', albumArt);
        //         console.log('Track Name:', trackName);
        //         console.log('Artist Name:', artistName);
        //         setTrackData({albumArt:albumArt,trackName:trackName,artistName:artistName})
        //     }
        //   }
        // });
        
        spotifyPlayer.connect();
        setPlayer(spotifyPlayer);

        
      };
    }
  }, [accessToken]);

  useEffect(() => {
  const initializePlayer = async () => {
    let currentAccessToken = accessToken;

    if (currentAccessToken) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new Spotify.Player({
          name: 'Next.js Spotify Player',
          getOAuthToken: cb => { cb(currentAccessToken); },
          volume: 0.5
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          localStorage.setItem('deviceID', device_id);
          console.log("localValue" + " " + localStorage.getItem('deviceID'));
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        spotifyPlayer.addListener('initialization_error', ({ message }) => {
          console.error('Failed to initialize', message);
        });

        spotifyPlayer.addListener('authentication_error', ({ message }) => {
          console.error('Failed to authenticate', message);
        });

        spotifyPlayer.addListener('account_error', ({ message }) => {
          console.error('Failed to validate Spotify account', message);
        });

        spotifyPlayer.addListener('playback_error', ({ message }) => {
          console.error('Failed to perform playback', message);
        });

        spotifyPlayer.addListener('player_state_changed', state => {
          console.log('changed' + state);
              if (state && state.track_window && state.track_window.current_track) {
                const currentTrack = state.track_window.current_track;
              
            
                if (currentTrack !== null && currentTrack.album && currentTrack.album.images &&  currentTrack.album.images.length > 0 && currentTrack.album.images[0].url){
                    const albumArt = currentTrack.album.images[0].url; // Album art URL
                    const trackName = currentTrack.name; // Track name
                    const artistName = currentTrack.artists.map(artist => artist.name).join(', '); // Artist name(s)
                    console.log('Album Art:', albumArt);
                    console.log('Track Name:', trackName);
                    console.log('Artist Name:', artistName);
                    setTrackData({albumArt:albumArt,trackName:trackName,artistName:artistName})
                }else {
                  console.log('No album art or track data available');
                }
              }else {
                console.log('No track playing or track data unavailable');
              } 
        });

        
        spotifyPlayer.connect();
        setPlayer(spotifyPlayer);
      
      };
    }
  };

  initializePlayer();
}, [accessToken]);



  const playSong = async (query) => {

   
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tracks');
        }

        const data = await response.json();
   
        let uri = data.tracks.items[0].external_urls.spotify;
        if(response.ok){
                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [uri] }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                }).then(response => {
                if (!response.ok) {
                    console.error('Failed to play song:', response.statusText);
                }
                }).catch(error => {
                       console.error('Error playing song:', error);
               });
        }
   
  };

  return (
    <div className={styles.webPlayer}>
      <div className={styles.webPlayer_top}>
       
        <div className={styles.webPlayer_album}>
          {trackData !== null &&
            <img src={ trackData.albumArt} className={styles.albumArt} width={105} height={105}/>
          } 

        {trackData === null &&
            <img src='/albums.png' className={styles.albumArt} width={105} height={105}/>
          } 
         

        </div>

        
                <div className={styles.webPlayer_controls}>
                       <button className={styles.playButton}>
                          <img src='/backward.png' width={30} height={30}/>
                      </button>
                      
                      <button className={styles.playButton}>
                          <img src={trackData !== null ? '/pause.png' : '/play.png'} width={32} height={32}/>
                      </button>

                      <button className={styles.playButton}>
                          <img src='/forward.png' width={30} height={30}/>
                      </button>
                </div>  
        
              </div>
       
      <div className={styles.webPlayer_bottom}>

         <p className={styles.trackName}> {trackData !== null ? trackData.trackName.slice(0,15) : "No Song"}..</p>
        {trackData !== null &&  <p className={styles.artistName}>By {trackData !== null && trackData.artistName.slice(0,25)}</p>}

      </div>
    </div>
  );
};

export default Player;
