import { useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {useHistory} from "react-router-dom";
import './Login.css';
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
        .then(async(res) => {
            let jsonData = await res.json();
               
            return {res:res , data : jsonData}
        })
        .then(result => {
            const res = result.res;
            const data = result.data;
            //console.log(res ,data);
            if(!res.ok){
                throw new Error(data.error.message);
            }
            //console.log(res);
            setError('');
            localStorage.setItem('token',data.token);
            localStorage.setItem('userId',data.userId);
            props.setIsAuth(true);
            //console.log(data);
            history.push('/home');
        })
        .catch(err => {
            setError(err.message);
        })
    }
    return ( 
        <div className="login-page">
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
        </div>
        
     );
}
 
export default Login;