import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Requests.css'; 
const Requests = ({setIsFriend}) => {
    const [usersRequsets,setUsersRequests] = useState({requests:[{username:'',image:''}]});
    useEffect(() => {
        fetch('http://localhost:4000/requests',{
            method:'GET',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if(!res.ok){
                throw new Error('we could not fetch requests now');
            }
            return res.json();
        })
        .then(data => {
            if(data.requests.length > 0 ){
                console.log(data.requests);
                setUsersRequests({ requests :data.requests.reverse() });
            }else {
                setUsersRequests({requests:[{username:'',image:''}]})
            }
        })
        .catch(err => {
            console.log(err);
        })
    },[])
    const handleConfirm = (id) => {
        fetch(`http://localhost:4000/request/confirm/${id}`,{
            method:'PATCH',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(data => {
            setUsersRequests({ requests :data.requests.reverse() });
            setIsFriend(true);

        })
        .catch(err =>{
            console.log(err);
        })
    }
    const handleIgnore = (id) => {
        fetch(`http://localhost:4000/request/ignore/${id}`,{
            method:'PATCH',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(data => {
            if(data.requests.length > 0 ){
                console.log(data.requests);
                setUsersRequests({ requests :data.requests.reverse() });
            }else {
                setUsersRequests({requests:[{username:'',image:''}]});
            }
        })
        .catch(err =>{
            console.log(err);
        })
    }
    return ( 
        <div className="requests">
            {!usersRequsets.requests[0].username && <div className='requests-no'>No Friend Request</div>}
            {usersRequsets.requests[0].username && usersRequsets.requests.map(user =>
            <div className="request-body" key={user._id}>
                <div className="request-body-header">
                    <img src={`http://localhost:4000/${user.image}`} className='request-body-image' alt={user.username} />
                    <Link className="request-body-link" to={`/profile/${user._id}`}>{user.username}</Link>
                </div>
                
                <button className="request-body-confirm" onClick={() => handleConfirm(user._id)}>Confirm</button>
                <button className="request-body-ignore" onClick={() => handleIgnore(user._id)}>Ignore</button>
            </div>
            )}
        </div>
     );
}
 
export default Requests;