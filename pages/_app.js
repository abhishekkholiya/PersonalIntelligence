import "@/styles/globals.css";
import Head from "next/head";
import {AuthContextProvider} from '../utils/AuthContext';

export default function App({ Component, pageProps }) {
  return  <AuthContextProvider>
 
 
   <Head>
             <link rel="icon" href="/logo.png" />
             <link rel="preconnect" href="https://fonts.googleapis.com"/>
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
   <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet"></link>
   <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>

             </Head>
         
   {/* <SessionProvider session={session}> */}
     
         <Component {...pageProps} />
     
   {/* </SessionProvider> */}
 


 {/* </ThemeProvider> Close the ThemeProvider */}

 </AuthContextProvider>
}
