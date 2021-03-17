import { Link } from 'react-router-dom';
import Logout from '../Logout/Logout';
import './Navbar.css';
const Navbar = (props) => {
    return ( 
        <nav className="navbar">
            <h1> Social media </h1>
            <div className="navbar-links"> 
                <li>{ props.isAuth && <Link to="/home">Home</Link>}</li>
                <li>{ props.isAuth &&<Link to={`/profile/${localStorage.getItem('userId')}`}>Profile</Link>}</li>
                <li>{ props.isAuth && <Link to="/chat">Chat</Link>}</li>
                <li>{ props.isAuth && <Logout setIsAuth={props.setIsAuth} />}</li>
                <li>{ !props.isAuth && <Link to="/login"> Login</Link>}</li>
                <li>{ !props.isAuth && <Link to="/register"> Register</Link>}</li>
            </div>
        </nav>
     );
}
 
export default Navbar;