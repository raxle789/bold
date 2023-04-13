import './profile.css';
import { Link } from 'react-router-dom';
import homeUnpressed from '../../assets/dashboard.svg';
import listUnpressed from '../../assets/kalender.svg';
import profilePressed from '../../assets/user ditekan.svg';
import avatar1 from '../../assets/avatar cowo.jpg';
import editIcon from '../../assets/edit.svg';
import { signOutUser } from '../../utils/firebase/firebase.util';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserField } from '../../utils/firebase/firebase.util';
import avatar2 from '../../assets/avatar cewe.jpg';

const Profile = () => {
    const key = 'USER_DATA';
    const checksStorage = () => {
        if (typeof(Storage) === undefined) {
          alert('Browser kamu tidak mendukung local storage, gunakanlah browser populer');
          return false;
        } else {
          return true;
        }
    }
    let user = null;
    if(checksStorage()){
      user = JSON.parse(localStorage.getItem(key));
    }
    console.log("id: ", user.uid);


    let [userField, setUserField] = useState({});
    const getUserData = async () => {
        setUserField(await getUserField(user.uid));
    }
    useEffect(() => {
        getUserData();
    }, []);

    const navigate = useNavigate();
    const handleSignOut = async () => {
        await signOutUser();
        navigate('/');
        console.log('user signed out!');
    }
    return (
        <>
            <div className="header-background">
                <div className="header-gradient"></div>
                <div className="header-gradient-cover"></div>
            </div>
            <header className="header-page">
                <h1 className="page-title">Profile</h1>
            </header>
            {/* <Link to="/edit-profile"><img src={editIcon} alt="edit Icon" className='edit-button' /></Link> */}
            <main className="body-container" style={{display: "flex", alignItems:"center", height:"70vh"}}>
                <div className='avatar-container'>
                    <img src={userField.gender === "Male" ? avatar1 : avatar2} className='avatar' alt="avatar" />
                    {/* <Link to="/edit-profile"><img src={editIcon} alt="edit Icon" className='edit-button' /></Link> */}
                </div>
                <div className='profile-container' style={{display: "flex"}}>
                    <div className='sub-profile-container1'>
                        <h2 className='name-label desc-label'>Name</h2>
                        <h2 className='display-name-label desc-label'>Display Name</h2>
                        <h2 className='bio-label desc-label'>Bio</h2>
                    </div>
                    {/* <div className='sub-profile-container3'>
                    </div> */}
                    <div className='sub-profile-container2'>
                        <h2 className='name desc'>{userField.displayName}</h2>
                        <h2 className='display-name desc'>{userField.greetingsName}</h2>
                        <h2 className='bio desc'>{userField.bio}</h2>
                        <div className='logout-button desc4' >
                            <Link className='logout-text' onClick={handleSignOut}>Log out</Link>
                        </div>
                    </div>
                </div>
            </main>
            <Link to="/edit-profile"><img src={editIcon} alt="edit Icon" className='edit-button' /></Link>
            <br /><br /><br /><br /><br />
            <div className='navigation'>
                <Link to="/home"><img src={homeUnpressed} alt="home unpressed" className='home-button' /></Link>
                <Link to="/list"><img src={listUnpressed} alt="list unpressed" className='list-button' /></Link>
                <Link to="/profile"><img src={profilePressed} alt="profile pressed" className='profile-button' /></Link>
            </div>
            <div className='credits-info'>Created by Abdullah Al Fatih<br /> <br />
                Thanks to:<br />
                https://products.aspose.app/imaging<br />
                https://colorhunt.co/<br />
                https://icons8.com/<br />
                id.pinterest.com <br />
                vercel.app<br /> <br />
            </div>
        </>
    );
}

export default Profile;

// <div className='sub-profile-container1'>
//                         <h2 className='name-label'>Name</h2>
//                         <h2 className='display-name-label'>Display Name</h2>
//                         <h2 className='bio-label'>Bio</h2>
//                     </div>
//                     <div className='sub-profile-container2'>
//                         <h2 className='name'>{userField.displayName}</h2>
//                         <h2 className='display-name'>{userField.greetingsName}</h2>
//                         <h2 className='bio'>{userField.bio}</h2>
//                         <div className='logout-button' >
//                             <Link className='logout-text' onClick={handleSignOut}>Log out</Link>
//                         </div>
//                     </div>