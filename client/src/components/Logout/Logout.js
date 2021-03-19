import { useHistory } from "react-router-dom";
import './Logout.css';
const Logout = (props) => {
    const history = useHistory();
    const handleLogout = (e) =>{
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        props.setIsAuth(false);
        history.push('/login');

    }
    return ( 
        <div className="logout">
            <form onSubmit={handleLogout}>
            <button className="btn">Logout</button>
            </form>
        </div>
     );
}
 
export default Logout;