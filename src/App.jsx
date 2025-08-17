import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Profile from "./pages/Profile/Profile"; 
import Download from "./pages/Download/Download";
import Vote from "./pages/Vote/Vote";
import VoteList from "./pages/VoteList/VoteList";
import Addpages from "./pages/Addpages/Addpages";
import UpdateVote from "./pages/UpdateVote/UpdateVote";
function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/download" element={<Download />} />
        <Route path="/voteList" element={<VoteList />} />
        <Route path="/Addpages" element={<Addpages />} />
        <Route path="/vote/:id" element={<Vote />} />
        <Route path="/UpdateVote/:id" element={<UpdateVote />} />
      </Routes>
    
  );
}

export default App; 