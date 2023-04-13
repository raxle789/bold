import './log-in.css';
import { ReactComponent as GoogleLogo } from '../../assets/Google__Logo.svg';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, RedirectSignIn } from '../../utils/firebase/firebase.util';
import { getRedirectResult } from "firebase/auth";

let ID = '';
const LogIn = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSignInResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if(result) {
                    navigate('/home');
                    ID = result.user;
                    console.log('ID', ID);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSignInResult();
    }, []);
    return (
        <>
            <div className='log-in-container' style={{display:"flex", alignItems:"center", height:"100vh"}}>
                <div>
                    <h1 className="bold-title">Bold.</h1>
                </div>
                <div className="main-container">
                    <h2 className="log-in-title">Log in</h2>
                    <div className="sub-container" onClick={RedirectSignIn} style={{display:"flex",alignItems:"center"}}>
                        <GoogleLogo className="google-logo" />
                        <h3 className="authentication">Log in with Google</h3>
                    </div>
                    <p className="other-option">Don't have an account?</p>
                    <div className="sub-container2" onClick={RedirectSignIn} style={{display:"flex",alignItems:"center"}}>
                        <GoogleLogo className="google-logo" />
                        <h3 className="authentication">Sign up with Google</h3>
                    </div>
                </div> 
            </div>
            <div className='blur-background'>
                <div className="ellips1"></div>
                <div className="ellips2"></div>
                <div className="rectangle1"></div>
                <div className="rectangle2"></div>
            </div>
        </>
    );
}

export const userData = () => {
    const { uid, displayName, email } = ID;
    return {
        uid,
        displayName,
        email
    }
};

export default LogIn;