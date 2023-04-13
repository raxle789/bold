import './App.css';
import { Routes, Route} from 'react-router-dom';
import LogIn from './routes/log in/log-in.component';
import Home from './routes/home/home.component';
import List from './routes/list/list.component';
import Profile from './routes/profile/profile.component';
import Edit from './routes/edit profile/edit.component';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="home" element={<Home />} />
      <Route path="list" element={<List />} />
      <Route path="profile" element={<Profile />} />
      <Route path="edit-profile" element={<Edit />} />
    </Routes>
  );
}

export default App;
