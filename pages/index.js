import Head from "next/head";
import Image from "next/image";
import {  Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Assistant from "./components/assistant";
import { useEffect,useState } from "react";
import Connectspotify from "./components/Connectspotify";
import Player from "./components/Player";
import { Speech } from "openai/resources/audio/speech";
import Navbar from "./components/Navbar";
import { useAuthContext } from '@/utils/AuthContext';
import { useRouter } from "next/router";


const inter = Inter({ subsets: ["latin"] }); 
const accessToken =process.env.ACCESS_TOKEN;


export default function Home() {

  const {user} = useAuthContext();
  const router = useRouter();


  useEffect(()=>{
      const getUserData = async ()=>{
          console.log("trying to fetch user");
          let response = await fetch(`/api/getuser?userUID=${user.uid}`);
          if(response.ok){
            let userData = await response.json();
            if(userData){
              router.push("/Intelligence");
            }
          }
        }
        getUserData();
  },[]);
 

  return (
    <>
      <Head>
        <title>Personal Intelligence</title>
        <meta name="description" content="Personal Intelligence, your personal AI for the web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/sparkle.png" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
       <Navbar/>
          <div className={styles.center_div}>
            <h1 className={styles.heading}>Introducing Personal Intelligence <br/> for your browser</h1>

            <button className={styles.try_button}>
              <p>Try Jarvis ✨</p>
            </button>
          </div>
      </main>
    </>
  );
}
