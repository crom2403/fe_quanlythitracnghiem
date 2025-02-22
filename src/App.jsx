import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import path from './utils/path';
import Public from './pages/public/Public';
import Home from './components/home/Home';
import Module from './components/module/Module';
import Login from './components/login/Login';

function App() {
  return (
    <div className="min-h-screen">
      <Router>
        <Routes>
          <Route path={path.PUBLIC} element={<Public />}>
            <Route path={path.HOME} element={<Home />} />
            <Route path={path.TEST} element={<Home />} />
            <Route path={path.MODULE} element={<Module />} />
            <Route path={path.QUESTION} element={<Home />} />
            <Route path={path.SUBJECT} element={<Home />} />
          </Route>
          <Route path={path.LOGIN} element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
