import logo from './logo.svg';

import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Pages/Home';
import Chat from './Pages/Chat';
function App() {
  return (
   
    <Router>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/chat/:id" element={<Chat/>}/>
      </Routes>
    </Router>
   
  );
}

export default App;
