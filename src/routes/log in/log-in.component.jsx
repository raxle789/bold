import './log-in.css';
import { ReactComponent as GoogleLogo } from '../../assets/Google__Logo.svg';
import { useNavigate } from 'react-router-dom';
import { PopupSignIn } from '../../utils/firebase/firebase.util';

let ID = '';
const LogIn = () => {
    const navigate = useNavigate();
    const fetchSignInResult = async () => {
        try {
            const result = await PopupSignIn();
            if(result) {
                ID = result.user;
                console.log('ID', ID);
                navigate('/home');
            }
        } catch (error) {
            console.log(error);
        }
    }; 
    return (
        <>
            <div className='log-in-container' style={{display:"flex", alignItems:"center", height:"100vh"}}>
                <div className='top-container'>
                    <h1 className="bold-title">Bold.</h1>
                    <h3 className='log-app-desc'>A Rote Management Tool</h3>
                </div>
                <div className="main-container">
                    <h2 className="log-in-title">Log in</h2>
                    <div className="sub-container" onClick={fetchSignInResult} style={{display:"flex",alignItems:"center"}}>
                        <GoogleLogo className="google-logo" />
                        <h3 className="authentication">Log in with Google</h3>
                    </div>
                    <p className="other-option">Don't have an account?</p>
                    <div className="sub-container2" onClick={fetchSignInResult} style={{display:"flex",alignItems:"center"}}>
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