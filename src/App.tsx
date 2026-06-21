import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Favorites from '@/pages/Favorites';
import Widget from '@/pages/Widget';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/widget" element={<Widget />} />
      </Routes>
    </Router>
  );
}
