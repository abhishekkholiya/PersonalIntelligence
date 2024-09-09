# Personal Intelligence ✨ for your browser  
  

It's name is Jarvis and it can play music, set reminders, find information on any topic and other things.

## Tech Stack  
- Next js
- MongoDB & Firebase (for Authentication)
- Open AI Gpt 4-0 Model
- Aws s3 bucket
  
## environment variables 
- OPENAI_KEY
- ASSISTANT_ID
- CLIENT_ID
- CLIENT_SECRET
- ACCESS_TOKEN
- FIREBASE_API_ID
- NEXT_PUBLIC_MONGODB_URI  
- NEXT_PUBLIC_ACCESS_KEY
- NEXT_PUBLIC_SECRET_KEY
- REFRESH_TOKEN
- FIREBASE_API_KEY  

## Instructions to run the project  
  First of all take deep breath and live in the moment for a minute,  
  Now that you are done, let's get started!  

## Step 1: Clone this repo   
  
  Run the command below in your terminal  
  ``` 
  git clone "repo link"
  ```    
   
## Step 2: run npm install  
  
  Cd into the project directory and run  
  ```
  npm install
  ```  
  
## Step 3: Adding all the environment variables  
  
  Now this is a bit lengthy part, so have some patience!  

  > create a .env file
  
  - go to [open.ai website]("https://platform.openai.com/docs/assistants/overview") and create an api key (OPENAI_KEY),
    navigate to dashboard and create a new assistant and get the assistant's id (ASSISTANT_ID)  
    > [!Note]
    > you will need to add credits minimum $5 dollars to use the open ai api (or you can wait for our free version of jarvis to launch)  
   
 - go to [mongodb]("mongodb.com") and sign up,  
   create a new mongodb cluster with the free tier and get the mongodb URI (NEXT_PUBLIC_MONGODB_URI)

 - go to [firebase]("https://firebase.google.com/") and sign up,
   we are using firebase for authentication, so create a new project in firebase and then select register a web app  
   after that you have to copy the code provided by firebase and delete the code in (utils/firebase.js) and paste your new code.  
  
-  go to [AWS]("https://aws.amazon.com/") and sign up,
   then head over to s3 and create a bucket, make sure to set bucket rules to allow traffic from anywhere,
   get the access key (NEXT_PUBLIC_ACCESS_KEY) and secret key (NEXT_PUBLIC_SECRET_KEY)
    
-  go to [spotify developer](https://developer.spotify.com/) website and sign up,
   then get an api key and access key (ACCESS_KEY) you will later get the refresh token
  
## Step 4: Run the code!  
  
  Run this command  
  ```
    npm run dev  
  ```  
    
the development server will start and you will be able to use jarvis at localhost:3000  (or whatever port is available)  
  
Hopefully, you are reached to this point, now you can sign up in the jarvis   
and an account will be created in the mongodb and   
then you can connect your spotify by clicking on the spotify icon   
and play music using jarvis!  

If you need help setting it up, join our [discord server](https://discord.gg/DcZmxMsfjb) I or the people there will help you :)  
  
Thanks,  
Happy coding!



