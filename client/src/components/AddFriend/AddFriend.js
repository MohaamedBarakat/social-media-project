import { useParams } from 'react-router';
import {useEffect, useState} from 'react';
import './AddFriend.css';
const AddFriend = () => {
    const [isFriend,setIsFriend] = useState(false);
    const {userId} = useParams();
    useEffect(() => {
        fetch(`http://localhost:4000/user`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
            method:'GET'
        })
        .then(res => {
            return res.json();
        })
        .then(data =>{
            return data.userFriends.includes(localStorage.getItem(userId)) || false;
        })
        .then(isFriend => {
            setIsFriend(isFriend);
        })
       
    }, [])
    const handleAddFriend = () =>{
        
    }
    return ( <div className="add-friend">
               {!isFriend && localStorage.getItem('userId') !== userId && <button onClick={handleAddFriend}>Add Friend</button>} 
            </div> );
}
 
export default AddFriend;