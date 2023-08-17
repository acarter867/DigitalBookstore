import './App.css';
import image from './assets/images/image.avif';
import {Routes, Route, Link} from "react-router-dom"
import Navbar from './components/nav';
import Admin from './components/admin/admin';
import Signup from './components/signup-login/signupForm';
import Login from './components/signup-login/loginForm';
import HomePage from './components/landing-pages/homePage';
import Search from './components/search/search';
import Signin from "./components/signup-login/signinLanding";

function App() {

  return (
    <>
    <div className="App">
      <Routes>
        <Route path='/' element={<><Navbar /> <HomePage /> <Search/></>} />    
        <Route path="/admin" element={<><Navbar /> <Admin /></>}/>
        <Route path="/signup" element={<><Navbar /> <Signup /></>}/>
        <Route path="/login" element={<><Navbar /> <Login /></>}/>
        <Route path='/signin' element={<><Navbar /> <Signin /> </>} />
      </Routes>      
    </div>
    </>
  );
}

export default App;
