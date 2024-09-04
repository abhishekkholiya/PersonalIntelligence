import fetch from "node-fetch";
import OpenAI from "openai";
export default function handler(req, res) {
    const openai = new OpenAI({apiKey:process.env.OPENAI_KEY});
    const request = req.query.query;

    async function classifyMusic(data) {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
            {
                headers: { Authorization: `Bearer ${API_TOKEN}` },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        return result;
    }
   
    async function query(data) {
        try{
           
            const completion = await openai.chat.completions.create({
                model: 'gpt-4', // Use the appropriate model
                messages: [
                    { role: 'system', content: "You are a helpful assistant named Jarvis created by Abhishek Kholiya." },
                    { role: 'user', content:`Classify the given query in play music, pause music, resume msuic,  weather or general. note: answer in only one word
                        query: ${data}
                       ` 
                    }
                ],
                max_tokens: 150,
                temperature: 0.7,
            });
            

            // query({inputs:data , parameters: {candidate_labels: ["play", "resume", "pause"]}}).then((response) => {
            //     console.log(JSON.stringify(response));
            // });
            const responseText = completion.choices[0].message.content;
            return responseText;

        }catch(err){
            console.log(err);
        }
    }

    async function answer(data) {
        // const response = await fetch(
        //     "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
        //     {
        //         headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}` },
        //         method: "POST",
        //         body: JSON.stringify(data),
        //     }
        // );
        // const result = await response.json();
        // return result;
        console.log(data);
        const completion = await openai.chat.completions.create({
            model: 'gpt-4', // Use the appropriate model
            messages: [
                { role: 'system', content: "You are a helpful assistant named Jarvis created by Abhishek Kholiya." },
                { role: 'user', content:`Extract the song name out from the query. note: answer the full song name only (if there is no song in the query just give the singer name)
                    query: ${data.inputs.context}
                   `  }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const responseText = completion.choices[0].message.content;
        return responseText;
    }
   
    // query({source_sentence:request, sentences: ["play some music","tell me the weather","other"]}).then((response) => {
    //     console.log("response" + JSON.stringify(response));
    //     // if(response[0] > response[1] && response[2]){
    //         answer({inputs:{question:"What is the song name?",context:request}}).then((response) => {
    //             // console.log(JSON.stringify(response));
    //             res.status(201).json({message:response.answer,intent:"music"});
    //         });
        
       
    // });

    // query({inputs:"The answer to the universe is"}).then((response) => {
    //     console.log(JSON.stringify(response));
    // });

    // query({inputs:request}).then((response) => {
    //     console.log(JSON.stringify(response));

    //     answer({inputs:{question:"what is the song name?",context:request}}).then((response) => {
    //                      console.log(JSON.stringify(response));
    //                     // res.status(201).json({message:response.answer,intent:"music"});
    //     });
    // });
    
    query(request).then((response)=>{
        console.log("response" + response);
        if(response && response.toLowerCase() === 'play music'){
            answer({inputs:{question:"what is the full song name?",context:request}}).then((response) => {
                                     console.log("here" + JSON.stringify(response));
                                    res.status(201).json({message:response,intent:"play music"});
                    });
        }else if (response && response.toLowerCase() === 'pause music'){
                console.log("pause music"); 
                res.status(201).json({message:response,intent:"pause music"});
        }else if(response && response.toLowerCase() === 'resume music'){
            console.log("resume music");
            res.status(201).json({message:response,intent:"resume music"});
        }else if(response && response.toLowerCase() === 'weather'){
            res.status(201).json({message:request,intent:"weather"});
        }else{
            res.status(201).json({message:request,intent:"general"});
        }
    })
}