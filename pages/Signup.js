import { useState ,useEffect, useRef} from 'react';
import styles from '../styles/SignUp.module.css';
import Link from 'next/link';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ReactTyped } from 'react-typed';
// import { useAuthContext } from '@/utils/AuthContext';
// import DropdownSelector from '../components/DropdownSelector';
import AWS from 'aws-sdk';
import { useAuthContext } from '@/utils/AuthContext';

import { useRouter } from 'next/router';
const auth = getAuth();
export default function SignUp (){
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [date,setDate] = useState(new Date());
    const [gender,setGender] = useState("");
    const [loading,setLoading] = useState(false);
    const [para,setPara] = useState(false);

    const [showForm,setForm] = useState(false);
    const {user} = useAuthContext();

   
    const [selectedAvatar,setSelectedAvatar] = useState(null);
    const [userAvatar,setUserAvatar]  = useState("");
    let userUID,Latitude,Longitude,location;
    location = '';
    const fileAvatarRef = useRef();
    const router = useRouter();

    useEffect(()=>{
        const getUserLocation = ()=>{
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                  Latitude = latitude;
                  Longitude = longitude;
                  // You can now send the latitude and longitude to your backend server
                },
                (error) => {
                  console.error('Error getting user location:', error);
                }
              );
            } else {
              console.error('Geolocation is not supported by this browser.');
            }
        }
        getUserLocation();
        if(user !== null){
            userUID = user.uid;
            setEmail(user.email);
            setForm(true);
        }
    },[]);


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

    const handleAddUser = async () => {
        try {
            console.log(user.uid);
            setLoading(true);
            let avatar = await uploadImageToS3(selectedAvatar);
            let userData = {
                userUID:user.uid,
                username:username,
                avatar:avatar,
                email:email,
                gender:"male",
              
                date_of_birth:date,
                usernumber:0,
              
                latitude:Latitude,
                longitude:Longitude,
                location:location,
                

            } 

            console.log(userData);
            if(email !== ''){
                userData.signup_method = 'email';
            }else{
                userData.signup_method = 'google';
            }
         
            const response = await fetch('/api/adduser', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
          
            
      
            if (response.ok) {
                console.log('job completed');
                router.push("/Intelligence");
                // router.push('/HomeScreen');
            } else {
                console.error('Error adding user:', response.statusText);
            }
        } catch (error) {
          console.error('Error adding user:', error.message);
        }
      }
      
    const uploadImageToS3 = async (givenFile) => {
        if (givenFile) {
          const fileName = name || givenFile.name;
          const params = {
            Bucket: 'ak15',
            Key: `${givenFile.name}${username}.${givenFile.type}`,
            Body: givenFile,
            ContentType:givenFile.type
          };
    
          try {
            const response = await s3.upload(params).promise();
            console.log(response.Location);
            //console.log('File uploaded successfully:', response.Location);
            return String(response.Location);
            // You can store the S3 URL or perform additional actions here.
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        } else {
          console.error('No file selected');
        }
    };

    const s3 = new AWS.S3({
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
        secretAccessKey:process.env.NEXT_PUBLIC_SECRET_KEY,
        region: 'ap-southeast-2',
      });

    
    const handleAvatarClick = ()=>{
        fileAvatarRef.current.click();
    }

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
  
        // Check if the selected file is an image
        if (file && file.type.includes('image/')) {
            setSelectedAvatar(file);
            // setPara(false);
          const reader = new FileReader();
          reader.onload = (e) => {
              // Set the data URL as the src attribute of the img element
              setUserAvatar(e.target.result);
          };
          reader.readAsDataURL(file);
        //  setChange(true);
            // return setContentType(file.slice(((file.lastIndexOf(".") - 1) >>> 0) + 2));
        } else {
            console.error('Please select a valid image file');
            setPara(true);
            setError('Selected document can only be an image');
        }
    }

    const genderOptions = [
        { value: 'male', label: 'male' },
        { value: 'female', label: 'female' },
        { value: 'others', label: 'others' },
    ];

    const handleGenderSelect = (gender)=>{
        setGender(gender);
    }

   console.log(user);
     const signInWithGoogle = async () => {
        console.log("hello");
        const provider = new GoogleAuthProvider();

            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    userUID = result.user.uid;
                    setEmail(user.email);
                    setForm(true);
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                }).catch((error) => {
                    console.log(error);
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // ...
                });
     };

    const handleEmailChange = (e)=>{
        return setEmail(String(e.target.value));
    }
    const handleDateChange = (e)=>{
        return setDate(String(e.target.value));
    }
    const handleUsernameChange = (e)=>{
        return setUsername(String(e.target.value));
    }
    const handlePasswordChange = (e)=>{
        return setEmail(String(e.target.value));
    }

    return(
        <>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.left_center}>
                            <button  className={styles.speak_button}>
                
                            </button>
                            <p className={styles.left_text}>
                                hey jarvis,  <span> </span>
                                     <ReactTyped strings={[" play espresso"," what's the weather like?"," add a note"," can you make a poem?"]} typeSpeed={50} backSpeed={50}  loop/>
 
                            </p>
                    </div>
                </div>
                <div className={styles.right}>
                    <h2 className={styles.right_header}>Get Started</h2>
                    <div className={styles.right_center}>
                        {showForm ? 
                            <>
                                {loading ?<p>Loading</p> :
                                    <>
                                        <div className={styles.profilePicture_Div} onClick={handleAvatarClick}  >
                                            <div  className={styles.profilePicture} style={{ backgroundImage: `url(${userAvatar !== '' ? userAvatar : '/user.png'})` }} ></div>  
                                            <input 
                                                    type="file"
                                                    className={styles.fileInput}
                                                    onChange={handleAvatarChange}
                                                    placeholder="Change Banner"
                                                    ref={fileAvatarRef}
                                                    
                                                />
                                        </div>

                                        <h1>Full Name</h1>
                                        <input
                                            type="text"
                                            onChange={(e)=>handleUsernameChange(e)}
                                            placeholder="Name"
                                            className={styles.emailInput}
                                        
                                        />
                                        <input
                                            type="date"
                                            onChange={(e)=>handleDateChange(e)}
                                            placeholder="Date of birth"
                                            className={styles.emailInput}
                                        
                                        />
                                        {/* <div className={styles.dropDown}>
                                            <DropdownSelector  options={genderOptions} onSelect={handleGenderSelect} customValue={"Gender"} />
                                        </div> */}

                                        <div className={styles.nextDiv}>
                                                <button className={styles.nextButton}  onClick={handleAddUser}>
                                                    <p>Next</p>
                                                </button>
                                        </div>
                                    </>
                                }
                                 {/* <DatePicker onChange={setDate} value={date} /> */}
                    
                            </>
                            :<>
                                <button className={styles.right_center_button} onClick={signInWithGoogle}>
                                    <div className={styles.right_center_button_div}>
                                        <p className={styles.right_center_button_div_text}>Sign up with</p>
                                        <img src='/google.png' width={30} height={30}/>
                                    </div>
                                </button>
                                <p className={styles.right_center_middle_text}>or</p>
                                <input
                                    type="text"
                                    onChange={(e)=>handleEmailChange(e)}
                                    placeholder="email"
                                    className={styles.emailInput}
                                
                                />
                                <input
                                    type="text"
                                    onChange={(e)=>handlePasswordChange(e)}
                                    placeholder="password"
                                    className={styles.emailInput}
                                
                                />
                                <button className={styles.right_center_button_two}>
                                
                                        <p className={styles.right_center_button_div_text}>Sign Up</p>
                                
                                </button>
                                <div className={styles.right_center_bottom}>
                                        <p className={styles.right_center_bottom_text}>Already have an account?</p>
                                        <Link href="/Login" className={styles.right_center_bottom_link}>Login</Link>
                                </div>
                            </>
                        }
                        
                    </div>
                </div>
            </div>
        </>
    )
}