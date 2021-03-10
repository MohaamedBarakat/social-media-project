import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import {useHistory} from "react-router-dom";
const Login = (props) => {
    const history = useHistory();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:4000/login',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        })
        .then(res => {
            console.log(res);
            return res.json();
        })
        .then(data => {
            setError('');
            localStorage.setItem('token',data.token);
            localStorage.setItem('userId',data.userId);
            props.setToken(data.token);
            props.setIsAuth(true);
            props.setUserId(data.userId);
            console.log(data);
            history.push('/home');
        })
        .catch(err => {
            setError(err.message);
        })
    }
    return ( 
        <div className="login">
            {error && <ErrorMessage error={error}/>}       
            <h2> Login </h2>
            <form onSubmit={handleSubmit}>
            <label> Email : </label>
                <input
                    type = "email"
                    value = {email}
                    placeholder = "Email"
                    required
                    onChange = {(e) => setEmail(e.target.value)}
                />
                <label> Password : </label>
                <input
                    type = "password"
                    value = {password}
                    placeholder = "password"
                    required
                    onChange = {(e) => setPassword(e.target.value)}
                />
                <button>Login</button>
            </form>
        </div>
     );
}
 
export default Login;