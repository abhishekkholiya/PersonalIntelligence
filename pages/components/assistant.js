import { useAuthContext } from '@/utils/AuthContext';
import styles from '@/styles/Assistant.module.css';
import { useState,useEffect,useRef } from 'react';


export default function Assistant (){
    const {user}  = useAuthContext();
    const [showChat,setShowChat] = useState(false);
    const [query,setQuery] = useState();
    const [messages,setMessages]  = useState([]);
    const [typing,setTyping] = useState(false);
    const [selectedMode,setSelectedMode] = useState("voice");
    const [transcript,setTranscript] = useState("Hey jarvis");
    const [userData,setUserData] = useState(null);
    const [accessToken,setAccessToken] = useState(" ");
    let thread,assistant;
   

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
      
      return data.access_token;
    };

    useEffect(()=>{
      const getUserData = async ()=>{
        console.log("trying to fetch user");
        if(user){
            let response = await fetch(`/api/getuser?userUID=${user.uid}`);
            if(response.ok){
              let userData = await response.json();
              setUserData(userData.user);
              setAccessToken(userData.user.spotify_access);
              console.log(userData);
            }
        }
      }
      getUserData();
    },[]);



    let speech  = ()=>{
                  // Check if the browser supports the Web Speech API
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              
              if (SpeechRecognition) {
                console.log('listening');
                const recognition = new SpeechRecognition();
                recognition.continuous = true; // Keep listening even after recognizing a speech input
                recognition.interimResults = false; // Only final results are processed
                recognition.lang = 'en-US'; // Set the language to English
              
                recognition.onstart = () => {
                   console.log("Voice recognition started. Try saying 'Hey Jarvis'.");
                  
                };
              
                recognition.onresult = async (event) => {
                  const deviceID = typeof window !== 'undefined' ? localStorage.getItem('deviceID') : null;
                  const transcript = event.results[event.results.length - 1][0].transcript.trim();
                  setTranscript(transcript)
                  console.log(transcript);
                 
                  console.log("token sent" + accessToken);
                  const response = await fetch(`/api/getassistant?query=${String(transcript)}&token=${accessToken}&deviceID=${deviceID}`);
                  let data = await response.json();
                  if(response.ok){
                    recognition.stop();
                    console.log("yes brother");
                      // const utterance = new SpeechSynthesisUtterance(data.message);
                      // utterance.lang = 'en-US';
                      //  speechSynthesis.speak(utterance);
                       console.log(data);
                        const utterance = new SpeechSynthesisUtterance(data.message);
                        utterance.lang = 'en-US';
                        speechSynthesis.speak(utterance);
                       if(data.type === 'reminder'){

                          setTimeout(()=>{
                            const newutterance = new SpeechSynthesisUtterance(data.reminder);
                            newutterance.lang = 'en-US';
                            speechSynthesis.speak(newutterance);
                            

                          },data.timing)
                       }

                   
                  }
              
                
                };
              
                // recognition.onerror = (event) => {
                //   console.error("Speech recognition error:", event.error);
                // };
              
                recognition.onend = () => {
                //  console.log("Speech recognition service disconnected.");
                  recognition.start(); // Restart recognition if it ends
                };
              
                // Start listening
                recognition.start();
              
                return () => {
                  recognition.stop(); // Stop recognition when the component unmounts
                };
              } else {
                console.warn("This browser does not support the Web Speech API.");
              }
    }
    async function open() {
        if (query) {
            let fullMessage = '';
            const accessToken =process.env.ACCESS_TOKEN;
            const deviceID = typeof window !== 'undefined' ? localStorage.getItem('deviceID') : null;
        // const transcript = event.results[event.results.length - 1][0].transcript.trim();
        // console.log("You said:", transcript);
        //const response = await fetch(`/api/getassistant?query=${String(transcript)}&token=${accessToken}&deviceID=${deviceID}`);
            const eventSource = new EventSource(`/api/getassistant?query=${String(query)}&token=${accessToken}&deviceID=${deviceID}`);
            // setQuery('');
      
             eventSource.onmessage = (event) => {
            const data = event.data;
      if (data === '[DONE]') {
        setTyping(false);
        eventSource.close();
       
        setMessages(prev => [...prev, fullMessage]);
      
      } else if (data === '[ERROR]') {
        setTyping(false);
        setMessages(prev => [...prev, "An error occurred."]);
        eventSource.close();
      } else {
        try {
          const parsedData = JSON.parse(data);
          if (parsedData.type === 'textCreated' || parsedData.type === 'textDelta') {
          
            if(parsedData.textDelta){
                fullMessage += parsedData.textDelta.value  ;
          
                // setMessages(prev => [...prev, parsedData.textDelta.value || parsedData.text.value]);

              
            }
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      }
    };

    eventSource.onerror = (error) => {
      setTyping(false);
      setMessages(prev => [...prev, "An error occurred."]);
      eventSource.close();
    };
  

      
            setTyping(true);
      
            return () => {
              eventSource.close();
            };
          }
        // fetch('/api/getassistant', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ query }),
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('Assistant response:', data.response);
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //     });


    }

    // useEffect(()=>{
    //     if(showChat){
    //        open();
    //     }
    // },[showChat]);
    const onQueryChange = (event)=>{
        setQuery(event.target.value);
    }
    const handleSubmit = ()=>{
       
        open();
        setMessages([]);
       
    }
    const handleKeyPress = (event)=>{
        if(event.key === 'Enter'){
            event.preventDefault();
            handleSubmit();  
            setQuery('');
            // let empty = '';
            // setQuery(empty);
        }
    }
    return(
        <>
            {showChat &&
                <div className={styles.chat} >
                    <div className={styles.chat_topDiv}>
                        <div className={styles.voice_div}>
                          <button className={selectedMode === 'voice' ? styles.top_button_selected : styles.top_button} onClick={()=>{setSelectedMode("voice")}}>
                            <p>Voice</p>
                          </button>
                        </div>

                        <div className={styles.chat_div}>
                          <button className={selectedMode === 'chat' ? styles.top_button_selected : styles.top_button} onClick={()=>{setSelectedMode("chat")}}>
                            <p>Chat</p>
                          </button>
                        </div>
                       
                    </div>

                    
                    {selectedMode ===  'voice' ?

                            <>
                                
                              <div className={styles.chat_middleDiv}>
                                      
                                  <div className={styles.chat_middleDiv_body}>
                                      

                                        <button onClick={speech} className={styles.speak_button}>
                                                
                                        </button>
                                  </div>
                                  <div className={styles.chat_middleDiv_subbody}>
                                    <p className={styles.transcript}>{transcript.slice(0,45)}..</p>

                                  </div>
                                </div>
                             

                          </>


                        :
                  
                          <>           
                                  <div className={styles.chat_middleDiv}>
                                  
                                    <div className={styles.chat_middleDiv_body}>
                                        <img src='/sparkle.png' className={styles.assistantLogo} width={30} height={30}/>
                                        <div className={styles.chat_middleDiv_subbody}>
                                        {messages.length > 0 && (
                                              <p>{messages[messages.length - 1]}</p> // Show the last concatenated message
                                        )
                                      
                                        }
                                        {messages.length<= 0 && typing === false && (
                                            <p>Hello there</p>
                                        )}
                                                
                                                {typing && <p>Assistant is typing...</p>}
                                        </div>
                                    </div>
                                    </div>
                                <div className={styles.chat_bottomDiv}>
                                    <div className={styles.chat_bottomDiv_textInput}>
                                      <input type='text' className={styles.textInput} onChange={onQueryChange} placeholder='Ask me anything' onKeyPress={handleKeyPress} value={query}/>
                                    </div>
                                  
                                    {/* <button onClick={open}>
                                        submit
                                    </button> */}
                                </div>
                        </>
                  
                    }
                      

                </div>
                }
                <button className={styles.container} onClick={()=>{setShowChat(!showChat);}}>
                     <img src='/sparkle.png' className={styles.image} width={25} height={25}/>
                </button>
            
            
              
        </>
    )
}