import './edit.css';
import { useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { addUser, getUserField } from '../../utils/firebase/firebase.util';

const Edit = () => {
    const [status, setStatus] = useState(false);
    const navigate = useNavigate();
    useEffect( ()=>{
        if(status === true) {
            alert('Ubahlah gender jika ingin mengganti avatar');
        }
        setStatus(true);
    }, [status]);

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

    let [userField, setUserField] = useState({});
    const getUserData = async () => {
        setUserField(await getUserField(user.uid));
    }
    useEffect(() => {
        getUserData();
    }, []);
    
    const handleCancel = () => {
        navigate('/profile');
    }
    const handleConfirm = async (e) => {
        e.preventDefault();
        console.log('userField', userField.displayName);
        userField.bio = userField.bio.slice(0,100);
        userField.greetingsName = userField.greetingsName.slice(0, 10); 
        await addUser(user.uid, userField);
        navigate('/profile');
    }

    console.log('id: ', user.uid);
    console.log('userField', userField);
    return (
        <Fragment>
            <h1 className='edit-title'>Edit Profile</h1>
            <div className='form-container'>
                <form className="form">
                    <label>Name:</label> <br />
                    <input type="text" name="nama" className='input-field' value={userField.displayName} onChange={(e) => {setUserField({...userField, displayName: e.target.value})}} /> <br />
                    <label>Display Name:</label> <br />
                    <input type="text" name="displayName" className='input-field' value={userField.greetingsName} onChange={(e) => {setUserField({...userField, greetingsName: e.target.value})}} /> <br />
                    <label>Gender: 
                        <input type="radio" name="gender" value="Male" onChange={(e) => {setUserField({...userField, gender: e.target.value})}} />Male
                        <input type="radio" name="gender" value="Female" onChange={(e) => {setUserField({...userField, gender: e.target.value})}} />Female <br />
                    </label> <br />
                    <label>Bio:</label> <br />
                    <textarea className='input-field last-input-field' value={userField.bio} onChange={(e) => {setUserField({...userField, bio: e.target.value})}}></textarea> <br />
                </form>
            </div>
            <div className='button-container'>
                <button className='cancel-button' onClick={handleCancel}>Cancel</button> <br />
                <button className='confirm-button' type="submit" onClick={handleConfirm}>Confirm</button> <br />
            </div>
        </Fragment>
    );
}

export default Edit;