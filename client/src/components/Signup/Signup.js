import { useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {useHistory} from 'react-router-dom';
import './Signup.css';
const Signup = () => {
    const history = useHistory();
    const [isPending , setIsPending] = useState(false);
    const [error,setError] = useState(null);
    const [ username , setUsername] = useState('');
    const [ email , setEmail] = useState('');
    const [ password , setPassword] = useState('');
    const [ confirmPassword , setConfirmPassword] = useState('');
    const handleSubmit = (e)=>{
        e.preventDefault();
        setIsPending(true);
        const userData = {username ,email,password,confirmPassword};
        console.log(userData);
        fetch('http://localhost:4000/signup',{
            method:'PUT',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(userData)
        })
        .then(res => {
            if(!res.ok){
                
            }
            //console.log(res.json());
            return res.json();

        })
        .then(data => {
            if(data.error){
                throw new Error(data.error.message);
            }
            setError('');
            console.log(data);
            history.push('/login');
        })
        .catch(error =>{
            console.log(error);
            setError(error.message);
            setIsPending(false);
        })
    }
    return ( 
        <div>
            <div className="split left">
                <div className="centered">
                    <h2>Welcome</h2>
                </div>
            </div>

            <div className="split right">
                <div className="centered">
                <div className="signup">     
                {error && <ErrorMessage error={error}/>}       
                <h2> Signup </h2>
                <form onSubmit={handleSubmit}>
                    <label> Username : </label>
                    <input 
                    type="text"
                    placeholder="Username"
                    required
                    value={username}
                    onChange = {(e)=> setUsername(e.target.value)}
                    />
                    <label> Email : </label>
                    <input 
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange = {(e) => setEmail(e.target.value)}
                    />
                    <label> Password : </label>
                    <input 
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange = {(e)=>setPassword(e.target.value)}
                    />
                    <label> Confirm Password : </label>
                    <input 
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange = {(e) => setConfirmPassword(e.target.value)}
                    />
                    {!isPending && <button> Signup</button>}
                    {isPending && <button disabled style={{background:'gray'}}> signing up</button>}
                </form>
            </div>
                </div>
            </div>
        </div>
        
   
     );
}
 
export default Signup;