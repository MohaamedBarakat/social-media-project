import { useParams } from 'react-router';
import './Unfriend.css';
const Unfriend = ({isFriend,setIsFriend}) => {
    const {userId} = useParams();
    const handleUnfriend = () => {
        console.log('hello');
    fetch(`http://localhost:4000/unfriend/${userId}`,{
        method:'PATCH',
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        }

    })
    .then(res => {
        if(!res.ok){
            throw new Error('could not unfriend now, please try again !!')
        }
        return res.json();
    })
    .then(data =>{
        console.log(data);
        setIsFriend(false);
    })
    
}
    return ( 
        <div className="unfriend">
            {isFriend && <button onClick={handleUnfriend} className="unfriend-btn">Unfriend</button>}
        </div>
     );
}
 
export default Unfriend;