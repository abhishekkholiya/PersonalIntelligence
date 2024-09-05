import { useState, useEffect } from 'react';
import styles from '@/styles/Sidebar.module.css';
import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '@/utils/AuthContext';
import Connectspotify from './Connectspotify';
export default function Sidebar (){
    const {user} = useAuthContext();
    const [userData,setUserData] = useState(null);
    useEffect(()=>{
        const getUserData = async ()=>{
            if(user){
                    console.log("trying to fetch user");
                    let response = await fetch(`/api/getuser?userUID=${user.uid}`);
                    if(response.ok){
                    let userData = await response.json();
                    setUserData(userData.user);
                    console.log(userData);
                    }
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
                            
                                <img src={userData !== null && userData.avatar} width={50} height={50} className={styles.userImage}/>
                              
                            </div>
                        </Link>

                        <div className={styles.Island}>
                            <Link href={'/Intelligence'} className={styles.Island_page}>
                            
                                <img src='/home.png' width={35} height={35}/>
                            </Link>

                            <Link href={'/Intelligence'} className={styles.Island_page}>
                            
                                    <img src='/albums.png' width={30} height={30}/>
                             </Link>
                        </div>

                        <div>
                             <Connectspotify/>
                        </div>

                    </ul>
            </nav>
        </div>
    )
}