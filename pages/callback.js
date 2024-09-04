import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const getToken = async (code) => {
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'http://localhost:3000/callback',
            client_id: '9ae550479915439097e1d643ee6caa79',
            client_secret: 'd39ce1e244c5456db991e50199035700',
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const { access_token ,refresh_token} = data;
        
          localStorage.setItem('spotifyAccessToken', access_token);
          localStorage.setItem('spotifyRefreshToken', refresh_token);

          // Redirect to the player or any page
          router.push('/');
          console.log("refresh token" + refresh_token);
        } else {
          console.error('Error getting Spotify token:', data);
        }
      } catch (error) {
        console.error('Error fetching Spotify token:', error);
      }
    };

    if (router.query.code) {
      getToken(router.query.code);
    }
  }, [router.query.code]);

  return <div>Connecting to Spotify...</div>;
};

export default Callback;
