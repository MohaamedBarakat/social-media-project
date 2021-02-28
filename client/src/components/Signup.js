import { useState } from "react";
import ErrorMessage from "./ErrorMessage";

const Signup = () => {
    const [error,setError] = useState(null);
    const [ username , setUsername] = useState('');
    const [ email , setEmail] = useState('');
    const [ password , setPassword] = useState('');
    const [ confirmPassword , setConfirmPassword] = useState('');
    const handleSubmit = (e)=>{
        e.preventDefault();
    const userData = {username ,email,password,confirmPassword};
        console.log(userData);
        fetch('url',{
            method:'PUT',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(userData)
        })
        .then((res)=>{
            if(!res.ok){
                throw Error('We could not Register you , Please try again later')
            }

        })
        .catch(error =>{
            console.log(error);
            setError(error.message);
        })
    }
    return ( 
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
            <button> Signup</button>

        </form>
        
    </div>
     );
}
 
export default Signup;