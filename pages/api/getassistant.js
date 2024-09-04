import OpenAI from 'openai';
const fs = require('fs');
import path from 'path';
export default function handler(req, res) {
    const openai = new OpenAI({apiKey:process.env.OPENAI_KEY});
    const message = async ()=>{
        try{
         

            let query = req.query.query;
            const accessToken = req.query.token;
            const deviceID = req.query.deviceID;
        



            if(query.toLowerCase().startsWith('play')){
                let result = query.replace("play", "").trim();
                let encodedQuery = encodeURIComponent(result);
                let encodedToken = encodeURIComponent(accessToken);
                let encodedDeviceID = encodeURIComponent(deviceID);
                let response =  await fetch(`http://localhost:3000/api/playsong?query=${encodedQuery}&token=${accessToken}&deviceID=${deviceID}`)
         
               if(response.ok){
                 let data = await response.json();
                 
                 return   res.status(200).json({ message: "sure hahahah" });
               }else{
                return res.status(200).json({ message: "sure" });
               }
            }

          

            

            let response =  await fetch(`http://localhost:3000/api/getintent?query=${query}`);
            if(response.ok){
                const data = await response.json();
                console.log(query);
                if(data.intent.toLowerCase() === 'play music' || data.intent.toLowerCase() === 'pause music'|| data.intent.toLowerCase() === 'resume music'){
                    let musicResponse =  await fetch(`http://localhost:3000/api/playsong?query=${query}&action=${data.intent}&token=${accessToken}&deviceID=${deviceID}`);
                  
                    if(musicResponse.ok){

                        let musicData = await musicResponse.json();
                        
                        
                        return   res.status(200).json({ message: musicData.to });
                      }else{
                       return res.status(200).json({ message: "sure" });
                      }
                }
                if(data.intent === 'general' || data.intent === 'weather'){

                    const completion = await openai.chat.completions.create({
                        model: 'gpt-4', // Use the appropriate model
                        messages: [
                            { role: 'system', content: "You are a helpful assistant named Jarvis created by Abhishek Kholiya." },
                            { role: 'user', content:`${query}`  }
                        ],
                        max_tokens: 100,
                        temperature: 0.7,
                    });
            
                    const responseText = completion.choices[0].message.content;
            
                    res.status(200).json({ message: `
                        
                            
                        ${responseText}` });
                }
            }


                   
                 
      
                
        }catch(error){
            console.error('Message Error',error);
            res.status(500).json({ error: 'An error occurred while processing your request.' });

        }
       
    }
    message();
  }
  