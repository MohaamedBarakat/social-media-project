import { Link } from 'react-router-dom';

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <h1> Social media </h1>
            <div className="links">
                <Link to="/login"> Login</Link>
                <Link to="/register"> Register</Link>

            </div>
        </nav>
     );
}
 
export default Navbar;