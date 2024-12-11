import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './page/Home';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Home/>} path='/'/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
