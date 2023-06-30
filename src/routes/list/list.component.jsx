import './list.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import homeUnpressed from '../../assets/dashboard.svg';
import listPressed from '../../assets/kalender ditekan.svg';
import profileUnpressed from '../../assets/user.svg';
import checkSignUnpressed from '../../assets/bulat.svg';
import checkSignPressed from '../../assets/bulat-ceklis.svg';
import wasteUnpressed from '../../assets/sampah.svg';
import arrow from '../../assets/back-next.svg';
import { addCollectionAndDocuments, getList, getUserField, addUser, deleteCollectionAndDocuments } from '../../utils/firebase/firebase.util';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const List = () => {
    const enterNotify = () => {
      toast('🦄 New rote saved!', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    const wasteNotify = () => {
      toast.error('Rote deleted!', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    const [date, setDate] = useState(new Date());
    const [lastDays, setLastDays] = useState(1);
    const [datePrint, setDatePrint] = useState(new Date().toDateString());
    const [firstDayIndex, setFirstDayIndex] = useState(date.getDay());
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    const renderCalendar = () => {
      const firstDate = new Date(date.valueOf());
      firstDate.setDate(1);
      setFirstDayIndex(firstDate.getDay());
      setLastDays(new Date(firstDate.getFullYear(), firstDate.getMonth()+1, 0).getDate());
    }; 

    useEffect(() => {
      renderCalendar();
      getData();
    }, [date]);

    useEffect( ()=>{
      getData();
    }, [datePrint] );

    const prevMonth = () => {
      setDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1));
      setDatePrint( new Date(date.getFullYear(), date.getMonth() - 1).toDateString());
    };

    const nextMonth = () => {
      setDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1));
      setDatePrint( new Date(date.getFullYear(), date.getMonth() + 1).toDateString());
    };


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


    const dateSetting = (numberDate) => {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${numberDate}-${month}-${year}`;
    }
    let formattedDate = dateSetting(date.getDate());
    console.log('formattedDate', formattedDate);

    let [userField, setUserField] = useState({});
    let [memoryList, setMemoryList] = useState({items: []});
    const getData = async ()=>{
      try {
        console.log("id: ", user.uid);
        console.log('getData', formattedDate);
        const data = await getList(user.uid, formattedDate);
        setMemoryList(data);
        const dataField = await getUserField(user.uid);
        setUserField(dataField);
      } catch(e) {
        console.log('gagal');
      }
    }


    const generateObject = (id, title, isComplete) => {
      return {
          id,
          title,
          isComplete
      }
    };

    const inputMemoryList = async (value) => {
      console.log('input memory list');
      if("items" in memoryList) {
        memoryList["items"].unshift(generateObject(+new Date(), value, false));
      } else {
        memoryList["items"] = [generateObject(+new Date(), value, false)];
      }
      await addCollectionAndDocuments(user.uid, formattedDate, memoryList);


      const arrayOfTimes = [new Date(date.getTime() + (1 * 24 * 60 * 60 * 1000)), new Date(date.getTime() + (2 * 24 * 60 * 60 * 1000)), new Date(date.getTime() + (4 * 24 * 60 * 60 * 1000)), new Date(date.getTime() + (8 * 24 * 60 * 60 * 1000)), new Date(date.getTime() + (16 * 24 * 60 * 60 * 1000)), new Date(date.getTime() + (30 * 24 * 60 * 60 * 1000)), new Date(date.getTime() + (60 * 24 * 60 * 60 * 1000))];
      const indexOfTimes = arrayOfTimes.length;
      let data2 = {};
      let formattedDateTemp = '';
      const dateSetting2 = (numberDate, month) => {
        const year = date.getFullYear();
        return `${numberDate}-${month+1}-${year}`;
      }


      for (let i = 0; i < indexOfTimes; i++) {
        formattedDateTemp = dateSetting2(arrayOfTimes[i].getDate(), arrayOfTimes[i].getMonth());
        data2 = {};
        data2 = await getList(user.uid, formattedDateTemp);
        if("items" in data2) {
          data2["items"].unshift(generateObject(+new Date(), value, false));
        } else {
          data2["items"] = [generateObject(+new Date(), value, false)];
        }
        await addCollectionAndDocuments(user.uid, formattedDateTemp, data2);
      }
          
      userField.createdItems += 8;
      await addUser(user.uid, userField);
      getData();
      enterNotify();
    }


    const handleDayClick = (e) => {
      const number = e.target.dataset.day;
      date.setDate(Number(number));
      setDatePrint(date.toDateString());
      console.log('handleday ', formattedDate);
      console.log('handle day click');
    };
    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
          inputMemoryList(e.target.value);
        }
    }

    
    const handleCheckClick = async (e) => {
      const indexItems = e.target.dataset.index;

      if(memoryList.items[indexItems].isComplete === false) {
        memoryList.items[indexItems].isComplete = true;
        const idItemList = memoryList.items[indexItems].id;
        const titleItemList = memoryList.items[indexItems].title;
        const statusItemList = memoryList.items[indexItems].isComplete;

        memoryList.items.splice(indexItems, 1);
        memoryList["items"].push(generateObject(idItemList, titleItemList, statusItemList));
        userField.finishedItems += 1;
      } else {
        memoryList.items[indexItems].isComplete = false;
        const idItemList = memoryList.items[indexItems].id;
        const titleItemList = memoryList.items[indexItems].title;
        const statusItemList = memoryList.items[indexItems].isComplete;

        memoryList.items.splice(indexItems, 1);
        memoryList["items"].unshift(generateObject(idItemList, titleItemList, statusItemList));
        userField.finishedItems -= 1;
      }
      
      await addUser(user.uid, userField);
      await deleteCollectionAndDocuments(user.uid, formattedDate);
      await addCollectionAndDocuments(user.uid, formattedDate, memoryList);
      getData();
    }

    const handleWasteClick = async (e) => {
      const indexItems = e.target.dataset.index;
      memoryList.items.splice(indexItems, 1);

      await addCollectionAndDocuments(user.uid, formattedDate, memoryList);
      getData();
      wasteNotify();
    }
    return (
      <>
        <div className="header-background">
            <div className="header-gradient"></div>
            <div className="header-gradient-cover"></div>
        </div>
        <header className="header-page">
            <h1 className="page-title">List</h1>
        </header>
        <main className="body-container" style={{display: "flex", justifyContent:"space-evenly", alignItems:"center"}}>
          <div className="calendar-container">
              <div className="date1-container">
                <div className="arrow-prev-container" onClick={prevMonth}><img src={arrow} alt="arrow prev" className="arrow-prev" /></div>
                <div className='month-year'>
                  <h1 className='month'>{months[date.getMonth()]}</h1>
                  <h3 className='year'>{date.getFullYear()}</h3>
                </div>
                <div className="arrow-next-container" onClick={nextMonth}><img src={arrow} alt="arrow next" className="arrow-next" /></div>
              </div>
              <div className='date2-container'>
                <div className='weekdays'>
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div className="days">
                  {[...Array(firstDayIndex).keys()].map(()=>(
                  <div className='prev-date'></div>
                  ))}
                  {[...Array(lastDays).keys()].map((v)=>(
                  <div className={`${  (v+1) === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth() ? 'today' : ''} month-days`} onClick={handleDayClick} data-day={v+1}>{v+1}</div>
                  ))}
                </div>
              </div>
          </div> 
          <div className='memory-container'>
            <input type='text' className='memory-input' onKeyPress={handleEnterPress} placeholder="Make New Rote"/>
            <h3 className='date-info'>{datePrint}</h3>
            {memoryList.items.map((unit, indeks)=>(
              <div key={unit.id} className='memory-item'>
                <div className='memory-title-container'>
                  <h3 className='memory-title'>{unit.title}</h3>
                </div>
                <div className='button-container'>
                  <img data-index={indeks}  src={unit.isComplete ? checkSignPressed : checkSignUnpressed} alt="is Complete Button" className='is-complete-button' onClick={handleCheckClick} />
                  <img data-index={indeks} src={wasteUnpressed} alt="waste Button" className='waste-button' onClick={handleWasteClick} />
                </div>
              </div>
            ))}
          </div>
        </main>
        <div className='footer-space'></div>
        <div className='navigation'>
            <Link to="/home"><img src={homeUnpressed} alt="home unpressed" className='home-button' /></Link>
            <Link to="/list"><img src={listPressed} alt="list pressed" className='list-button' /></Link>
            <Link to="/profile"><img src={profileUnpressed} alt="profile unpressed" className='profile-button' /></Link>
        </div>
        <ToastContainer />
      </>
    );
}

export default List;