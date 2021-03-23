import { useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {Link, useHistory} from "react-router-dom";
import './Login.css';
import image from '../../images/pexels-photo-1122410.jpeg';
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
            <img src={image} className='login-image'/>      
            <h2> Welcome </h2>
            <p>Login by entering the information below </p>
            <form onSubmit={handleSubmit}>
            <label> Email : </label>
                <input
                    type = "email"
                    value = {email}
                    placeholder = "Email"
                    required
                    onChange = {(e) => setEmail(e.target.value)}
                />
                <hr className='login-hr'/>
                <label> Password : </label>
                <input
                    type = "password"
                    value = {password}
                    placeholder = "password"
                    required
                    onChange = {(e) => setPassword(e.target.value)}
                />
                <hr className='login-hr'/>
                <Link className='login-forget-password' to={'/forget'}>Forget password</Link>
                <button>Login</button>
                <p style={{margin:'1rem 0 0 0'}}>Don't have an account? </p>
                <Link to='/register'>SIGN UP</Link>
            </form>
        </div>
        </div>
        
     );
}
 
export default Login;