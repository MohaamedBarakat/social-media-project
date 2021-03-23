import { useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {Link, useHistory} from 'react-router-dom';
import './Signup.css';
const Signup = () => {
    const history = useHistory();
    const [isPending , setIsPending] = useState(false);
    const [error,setError] = useState(null);
    const [ firstname , setFirstname] = useState('');
    const [ lastname , setLastname] = useState('');
    const [ email , setEmail] = useState('');
    const [ password , setPassword] = useState('');
    const [ confirmPassword , setConfirmPassword] = useState('');
    const [phonenumber,setPhonenumber] = useState('');

    const handleSubmit = (e)=>{
        e.preventDefault();
        setIsPending(true);
        const userData = {firstname, lastname, phonenumber, email, password,confirmPassword};
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
            history.push('/');
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
                <div className="signup">     
                {error && <ErrorMessage error={error}/>}       
                <h2> Signup </h2>
                <form onSubmit={handleSubmit}>
                   
                    <label className='firstname-label'> Firstname* </label>
                    <label className='lastname-label'> Lastname*</label>
                    <div style={{display:'block'}}></div>
                    <input 
                    type="text"
                    placeholder="Firstname"
                    required
                    className="firstname"
                    value={firstname}
                    onChange = {(e)=> setFirstname(e.target.value)}
                    />
                    
                    <input 
                    type="text"
                    placeholder="Lastname"
                    required
                    value={lastname}
                    className="lastname"
                    onChange = {(e)=> setLastname(e.target.value)}
                        />
                 
                    <label> Email* </label>
                    <input 
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    className='signup-input'
                    onChange = {(e) => setEmail(e.target.value)}
                    />
                    <label> Phone number* </label>
                    <input 
                    type="text"
                    placeholder="Phone number"
                    required
                    value={phonenumber}
                    className='signup-input'
                    onChange = {(e) => setPhonenumber(e.target.value)}
                    />
                    <label> Password* </label>
                    <input 
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    className='signup-input'
                    onChange = {(e)=>setPassword(e.target.value)}
                    />
                    <label> Confirm Password* </label>
                    <input 
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    className='signup-input'
                    onChange = {(e) => setConfirmPassword(e.target.value)}
                    />
                    {!isPending && <button> Signup</button>}
                    {isPending && <button disabled style={{background:'gray'}}> signing up</button>}
                </form>
                <p style={{margin:'2rem 0 0 0',color:'gray'}}>have an account? </p>
                <Link to='/'>LOGIN</Link>
            </div>
            </div>
        </div>
        
   
     );
}
 
export default Signup;