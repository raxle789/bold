import "./home.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import myGif1 from "../../assets/Relaxing_gif1.gif";
import myGif2 from "../../assets/Relaxing_gif2.gif";
import myGif3 from "../../assets/Relaxing_gif3.gif";
import myGif4 from "../../assets/Relaxing_gif4.gif";
import myGif5 from "../../assets/Relaxing_gif5.gif";
import myGif6 from "../../assets/Relaxing_gif6.gif";
import myGif7 from "../../assets/Relaxing_gif7.gif";
import homePressed from "../../assets/dashboard ditekan.svg";
import listUnpressed from "../../assets/kalender.svg";
import profileUnpressed from "../../assets/user.svg";
import { userData } from "../log in/log-in.component";
import { addUser, getUserField, getUser } from "../../utils/firebase/firebase.util";
import { signOutUser } from '../../utils/firebase/firebase.util';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const key = "USER_DATA";
    const dataFromUser = userData();
    let user = null;

    const checksStorage = () => {
        if (typeof(Storage) === "undefined") {
            alert(
                "Browser kamu tidak mendukung local storage, gunakanlah browser populer"
            );
            return false;
        } else {
            return true;
        }
    };
    const loadUserData = async () => {
        let userObject = {
            greetingsName: "User",
            bio: "",
            gender: "Male",
            createdItems: 0,
            finishedItems: 0,
            ...dataFromUser,
        };
        console.log(userObject);
        if (checksStorage()) {
            localStorage.removeItem(key);
            user = JSON.parse(localStorage.getItem(key));
            console.log('user', user);
            if (user === null || user === "undefined" || user.uid != dataFromUser.uid) {
                console.log("set local");
                localStorage.setItem(key, JSON.stringify(userObject));
                user = JSON.parse(localStorage.getItem(key));
                console.log('user huuu', user);
            }
        }

        const confirm = await getUserField(user.uid);
        if (confirm === "undefined") {
            await addUser(user.uid, userObject);
        } else {
            userObject = confirm;
            localStorage.setItem(key, JSON.stringify(userObject));
            user = JSON.parse(localStorage.getItem(key));
            console.log("userObject", userObject);
        }
    };


    let [userField, setUserField] = useState({});
    const getUserData = async () => {
        console.log('id', user.uid);
        const data = await getUserField(user.uid);
        setUserField(data);
    };

    useEffect(() => {
        loadUserData();
        getUserData();
    }, []);
    
    
    const whatDay = new Date().getDay();
    const Gifs = [myGif1, myGif2, myGif3, myGif4, myGif5, myGif6, myGif7];
    const justGif = Gifs[whatDay];
    return (
        <>  
            <div className="header-background">
                <div className="header-gradient"></div>
                <div className="header-gradient-cover"></div>
            </div>
            <header className="header-page">
                <h1 className="page-title">Home</h1>
            </header>
            <main className="body-container" style={{display: "flex", justifyContent:"space-evenly", alignItems:"center", height:"70vh"}}>
                <div className="left-side-info">
                    <h2 className="greetings">
                        Hello,{" "}
                        {userField.greetingsName === null ? "User" : userField.greetingsName}
                    </h2>
                    <p className="quotes">
                        “Details matter, it’s worth waiting to get it right.” <br /> - Steve
                        Jobs
                    </p>
                    <div className="statistic-container">
                        <br />
                        <h2 className="statistic">Statistic</h2> 
                        <h1 className="created-status">
                            <span className="sub-created-status">{userField.createdItems}</span> Memories Created
                        </h1>
                        <h1 className="finished-status">
                            <span className="sub-finished-status">{userField.finishedItems}</span> Memories Finished
                        </h1>
                    </div>
                </div>
                <div className="gif-container">
                    <img src={justGif} alt="relaxing gif" className="gif" />
                </div>
            </main>
            <div className="navigation">
                <Link to="/home">
                    <img src={homePressed} alt="home pressed" className="home-button" />
                </Link>
                <Link to="/list">
                    <img
                        src={listUnpressed}
                        alt="list unpressed"
                        className="list-button"
                    />
                </Link>
                <Link to="/profile">
                    <img
                        src={profileUnpressed}
                        alt="profile unpressed"
                        className="profile-button"
                    />
                </Link>
            </div>
        </>
    );
};

export default Home;
