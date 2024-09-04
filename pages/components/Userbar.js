import { useEffect,useState } from 'react';
import styles from '@/styles/Userbar.module.css';
import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '@/utils/AuthContext';
export default function Userbar (){
    const {user} = useAuthContext();
    const [userData,setUserData] = useState(null);
    useEffect(()=>{
        const getUserData = async ()=>{
            console.log("trying to fetch user");
            let response = await fetch(`/api/getuser?userUID=${user.uid}`);
            if(response.ok){
              let userData = await response.json();
              setUserData(userData.user);
              console.log(userData);
            }
          }
          getUserData();
    },[]);
    return(
        <div className="navbar" style={{}}>
        <nav className={`${styles.mainnav}`}>
                <ul>

                    <Link href={'/'}>
                        <div className={styles.logoContainer}>
                           
                            <img src={userData !== null && userData.avatar} width={45} height={45} className={styles.userImage}/>
                            <p className={styles.userName}>{userData !== null && userData.username}</p>
                        </div>
                    </Link>
                
                
                   
                </ul>
        </nav>
        </div>
    )
}