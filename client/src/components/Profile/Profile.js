import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AddFriend from "../AddFriend/AddFriend";
import NewPost from "../NewPost/NewPost";
import Posts from "../Posts/Posts";
import ProfileImage from "../ProfileImage/ProfileImage";
import UpdateProfile from "../UpdateProfile/UpdateProfile";
import './Profile.css';
const MyProfile = () => {
    const {userId} = useParams();
    const [isEdit,setIsEdit] =useState(false);
    const [isEditProfile,setIsEditProfile] =useState(false);
    const [name,setName] = useState('');
    const [oldPassword,setOldPassword] = useState('');
    const [password,setPassword] = useState('');
    const [newPost,setNewPost] = useState('');
    const [postImage , setPostImage] = useState('');
    const [posts,setPosts] = useState([{likes:[]}]);
    const [userImage,setUserImage] = useState('');

    useEffect(()=>{
        console.log(userId);
        fetch('http://localhost:4000/posts/'+userId,{
            method:'GET',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
        })
        .then(res =>{
            if(!res.ok){
                throw new Error('error');
            }
            return res.json();
        })
        .then(data =>{
            //console.log(data)
            setUserImage(data.user.image);
            setPosts(data.posts.reverse());
            setName(data.username);
            //console.log(posts);
        }).catch(err => {
           console.log(err);
        })
    },[]);
    
    const handleIsEditProfile = () => {
        setIsEdit(true);
    }
    const handleClose = ()=>{
        setIsEdit(false);
    }
    const handleEditProfile = () => {
        setIsEditProfile(true);
    }
   
   
    
    return ( 
        <div className="profile" >
            <div>
                <ProfileImage userImage={userImage}/>
            </div>
            <div>
                <AddFriend />
            </div>
            <p><b>{name}</b></p>
            {localStorage.getItem('userId') === userId && <button onClick={handleEditProfile} className='edit-profile-image-btn'>Edit profile Image</button>}
            {isEditProfile && <UpdateProfile setIsEditProfile={setIsEditProfile} userImage={userImage} setUserImage={setUserImage}/>}
            <NewPost setPosts={setPosts} newPost={newPost} setNewPost={setNewPost} setPostImage={setPostImage}/>
            <Posts posts={posts} setPosts={setPosts} />

        </div>  
     );
}
 
export default MyProfile;