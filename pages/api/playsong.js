export default async function handler(req, res) {
    const action = req.query.action;
    const query = req.query.query;
    let accessToken =  req.query.token;
    let deviceID = req.query.deviceID;
  


    //to get a new access token
    const refreshAccessToken = async (refreshToken) => {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
            }),
        });
    
      
    
        const data = await response.json();
        console.log("new real token is here" + data.access_token);
        accessToken = data.access_token;
        return data.access_token;
    };

    const getAvailableDevices = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
       
    
        if (!response.ok) {
          throw new Error(`Failed to fetch devices: ${response.statusText}`);
        }
    
        const data = await response.json();
      
        let newID = data.devices.filter((i)=>i.name === 'Next.js Spotify Player');
        console.log(newID[0].id);
        return newID[newID.length - 1].id; // Returns an array of available devices
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

      const searchTrack = async (query) => {

          try{
           

                let response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
                    headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    },
                });


                if(response.status ===401){

                  
                    console.log("401 401 401 401");
                    let newToken = await refreshAccessToken(process.env.REFRESH_TOKEN);
                      if(newToken){
                              accessToken = newToken;
                              response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
                                headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                },
                            });
                            let updatedData = {
                              spotify_access:newToken
                            }
                            let updateUser = await fetch("http://localhost:3000/api/updateuser",{
                              method:'POST',
                              headers:{
                                'Content-Type':'application/json'
                              },
                              body:JSON.stringify({userUID:"ZYLCchMXdZghcejbTcGLu4c7vNf1",newData:updatedData})
                            }).then((data)=>console.log("job done"))
                            .catch((err)=>console.error(err))
                            

                      }
                  
                }
                if (!response.ok) {
                    const errorBody = await response.text();
                    console.error('Error response body:', errorBody);
                }
                const data = await response.json();
            
                if(data.tracks.items.length >= 1){
                  return data.tracks.items[0].external_urls.spotify; 
                }

                
              }catch(err){
                console.log(err);
              }
                
      };

      const playTrack = async (trackUri) => {
        if (!deviceID) {
          console.error('No device ID available');
          throw new Error('No active device found');
        }
      
        try {        
          console.log(`Attempting to play track on device: ${deviceID}, URI: ${trackUri}`);
          const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [trackUri] }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          
          if (!response.ok) {
            const errorBody = await response.text();
            console.error('Failed to play song:', response.statusText, 'Response body:', errorBody);
          } else {
            console.log('Track is playing successfully');
          }
        } catch (error) {
          console.error('Error playing song:', error);
        }
      };
      

      const playSong = async (query) => {
        try {
          const track = await searchTrack(query);
         
          if (track) {
            console.log("track track" + track);
            await playTrack(track);
      
            res.status(201).json({message:"playing successfully"});
          } else {
            console.log('Track not found');
            res.status(401).json({message:"track not found"});

          }
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({error:error});
          
        }
      };

      const resumeSong = async ()=>{
        
          
          const response = await fetch('https://api.spotify.com/v1/me/player/play', {
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
              },
          });

          if (!response.ok) {
              const errorBody = await response.text();
              throw new Error(`Failed to pause track, status: ${response.status}, response: ${errorBody}`);
              console.log(response.status);
              console.log(errorBody);
          }
          return res.status(200).json({ message: "resumed" });
       
      }

      const pauseSong = async ()=>{
      
          
          const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
              },
          });
  
          if (!response.ok) {
              const errorBody = await response.text();
              console.log(response.status);
              console.log(errorBody);
             
          }
          return res.status(200).json({ message: "paused" });
          
      }

    if(action === 'play music'){
      await playSong(query);
    }else if(action === 'pause music'){
      await pauseSong();
    }else{
      await resumeSong();
    }

      // switch(action){
      //   case "music":
      //     await playSong(query);
      //   case 'music/resume':
      //     await resumeSong();
      //   case 'music/pause': 
      //     await pauseSong();
        
      //   default: 
      //     console.log("unknown query");
      // }
      
  
}