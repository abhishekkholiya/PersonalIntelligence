import Head from "next/head";
import Image from "next/image";
import {  Inter } from "next/font/google";
import styles from "@/styles/Intelligence.module.css";
import Assistant from "./components/assistant";
import { useEffect } from "react";
import Connectspotify from "./components/Connectspotify";
import Player from "./components/Player";
import { Speech } from "openai/resources/audio/speech";
import { useAuthContext } from "@/utils/AuthContext";
import Userbar from './components/Userbar';
import Sidebar from './components/Sidebar'


const inter = Inter({ subsets: ["latin"] }); 
const accessToken =process.env.ACCESS_TOKEN;


export default function Intelligence() {

  const {user} = useAuthContext();

  useEffect(()=>{
    const getUserData = async ()=>{
      console.log("trying to fetch user");
      let response = await fetch(`/api/getuser?userUID=${user.uid}`);
      if(response.ok){
        let userData = await response.json();
        console.log(userData);
      }
    }
    getUserData();
  },[]);
  let speech  = ()=>{
    // Check if the browser supports the Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = true; // Keep listening even after recognizing a speech input
  recognition.interimResults = false; // Only final results are processed
  recognition.lang = 'en-US'; // Set the language to English

  recognition.onstart = () => {
     // console.log("Voice recognition started. Try saying 'Hey Jarvis'.");
     
  };

  recognition.onresult = async (event) => {
    const deviceID = typeof window !== 'undefined' ? localStorage.getItem('deviceID') : null;
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    console.log(transcript);
    const response = await fetch(`/api/getassistant?query=${String(transcript)}&token=${accessToken}&deviceID=${deviceID}`);
    let data = await response.json();
    if(response.ok){
      recognition.stop();
        const utterance = new SpeechSynthesisUtterance(data.message);
        utterance.lang = 'en-US';
        return speechSynthesis.speak(utterance);
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

  return (
    <>
      <Head>
        <title>Personal Intelligence</title>
        <meta name="description" content="Personal Intelligence, your personal AI for the web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/sparkle.png" />
      </Head>
      
      <div className={`${styles.container} ${inter.className}`}>

      <Sidebar/>
       
        {/* <button onClick={speech} className={styles.speak_button}>
        
        </button> */}

         
            <Assistant/>
       
        <div className={styles.contentArea}>

          <div className={styles.content}>

              <div className={styles.row_one}>
                 <h2 className={styles.greeting}>Hey, Welcome</h2>
              </div>

              <div className={styles.row_two}>
                    <div className={styles.player}>

                          <Player/>

                    </div>
                    <div className={styles.notes}>
                        <h2 className={styles.notes_header}>Notes</h2>

                        <textarea placeholder="quickly type something here" className={styles.notes_textArea}>

                        </textarea>

                    </div>
              </div>

          </div>
                

              
            

       

        </div>

     
       
      </div>
    </>
  );
}
