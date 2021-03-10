import { useHistory } from "react-router-dom";

const Logout = (props) => {
    const history = useHistory();
    const handleLogout = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        props.setIsAuth(false);
        history.push('/');

    }
    return ( 
        <div className="logout">
           <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
     );
}
 
export default Logout;