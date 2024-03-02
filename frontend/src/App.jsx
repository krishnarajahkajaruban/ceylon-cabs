import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Services from './pages/Services/Services';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {

    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact-us' element={<Contact />} />
            <Route path='/services' element={<Services />} />
            <Route path='/log-in' element={<Login />} />
            <Route path='/sign-up' element={<Register />} />
            <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
    );
}

export default App;