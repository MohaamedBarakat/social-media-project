import { useParams } from 'react-router';
import {useEffect, useState} from 'react';
import './AddFriend.css';
const AddFriend = ({isFriend,setIsFriend}) => {
    const [isAddFriend,setIsAddFriend] = useState(false);
    const {userId} = useParams();
    useEffect(() => {
        fetch(`http://localhost:4000/user/${userId}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
            method:'GET'
        })
        .then(res => {
            return res.json();
        })
        .then(data =>{
            const isFriend = data.userFriends.includes(localStorage.getItem('userId'));
            const isAdded = data.userRequests.includes(localStorage.getItem('userId'));
            console.log(isFriend,isAdded);
            setIsFriend(isFriend);
            setIsAddFriend(isAdded);

        })
        .catch(err =>{
            console.log(err);
        })
   
       
    }, [])
    const handleAddFriend = () =>{
        fetch(`http://localhost:4000/add-friend/user/${userId}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            method:'PUT'
        })
        .then(res => {
            if(!res.ok){
                throw Error('Could not add this friend now, please try again later');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            const isAdded = data.userRequests.includes(localStorage.getItem('userId'));
            console.log(isAdded);
            setIsAddFriend(isAdded);
        })
        .catch(err => {
            console.log(err);
        })
    };
    const handleCancelRequest = () => {
        fetch(`http://localhost:4000/cancel-request/user/${userId}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
            method:"PATCH"
        })
        .then(res => {
            if(!res.ok){
                throw new Error('Could not cancel request now, please try again later');
            }
            return res.json();
        })
        .then(data => {
            const isAdded = data.userRequests.includes(localStorage.getItem('userId'));
            setIsAddFriend(isAdded);
        })
        .catch(err =>{
            console.log(err);
        })
    }
    return ( <div className="add-friend">
               {!isAddFriend && !isFriend && localStorage.getItem('userId') !== userId && <button onClick={handleAddFriend}>Add Friend</button>} 
               {isAddFriend && localStorage.getItem('userId') !== userId && <button onClick={handleCancelRequest}>Cancel Request</button>} 

            </div> );
}
 
export default AddFriend;