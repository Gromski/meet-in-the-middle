import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import MeetupPage from './components/MeetupPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meetup/:meetupId" element={<MeetupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
