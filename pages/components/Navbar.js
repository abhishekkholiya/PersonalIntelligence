
import styles from '@/styles/Navbar.module.css';
import Image from 'next/image'
import Link from 'next/link'
export default function Navbar (){
    return(
        <div className="navbar" style={{}}>
        <nav className={`${styles.mainnav}`}>
                <ul>

                    <Link href={'/'}>
                        <div className={styles.logoContainer}>
                           
                            <img src='/sparkle.png' width={55} height={55}/>
                        </div>
                    </Link>
                
                
                    <Link href="/Signup" className={styles.signupdiv} >
                        <h2 className={styles.signuptext}>SIGN UP</h2>
                        
                    </Link>

                </ul>
        </nav>
        </div>
    )
}