import { Link } from 'react-router-dom';
import Logout from './Logout';

const Navbar = (props) => {
    return ( 
        <nav className="navbar">
            <h1> Social media </h1>
            <div className="links"> 
                <li>{ props.isAuth && <Link to="/home">Home</Link>}</li>
                <li>{ props.isAuth &&<Link to="/profile">Profile</Link>}</li>
                <li>{ props.isAuth && <Link to="/chat">Chat</Link>}</li>
                <li>{ props.isAuth && <Logout setIsAuth={props.setIsAuth} setToken={props.setToken} setUserId={props.setUserId}/>}</li>
                <li>{ !props.isAuth && <Link to="/login"> Login</Link>}</li>
                <li>{ !props.isAuth && <Link to="/register"> Register</Link>}</li>
            </div>
        </nav>
     );
}
 
export default Navbar;