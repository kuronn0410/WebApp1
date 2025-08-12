import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Profile from "./pages/Profile/Profile"; 
import Download from "./pages/Download/Download";
import Vote from "./pages/Vote/Vote";
function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} /> {/* 新ページ */}
        <Route path="/download" element={<Download />} />
        <Route path="/vote" element={<Vote />} />
      </Routes>
    
  );
}

export default App; 