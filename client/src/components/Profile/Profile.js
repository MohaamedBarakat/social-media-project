import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AddFriend from "../AddFriend/AddFriend";
import NewPost from "../NewPost/NewPost";
import Posts from "../Posts/Posts";
import ProfileImage from "../ProfileImage/ProfileImage";
import Unfriend from "../Unfriend/Unfriend";
import UpdateProfile from "../UpdateProfile/UpdateProfile";
import useFetchPost from '../useFeatchPost';
import './Profile.css';
const MyProfile = ({isFriend,setIsFriend}) => {
    const {userId} = useParams();
    const [isEdit,setIsEdit] =useState(false);
    const [isEditProfile,setIsEditProfile] =useState(false);
    const [name,setName] = useState('');
    const [newPost,setNewPost] = useState('');
    const [postImage , setPostImage] = useState('');
    const [userImage,setUserImage] = useState('');
    const {posts,setPosts,isPending,error} = useFetchPost(`http://localhost:4000/posts/${userId}`);
    useEffect(()=>{
        //console.log(userId);
        fetch(`http://localhost:4000/data/user/${userId}`,{
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
            if(!isPending){
                console.log(posts);
            }
            setUserImage(data.user.image);
            setName(`${data.user.firstname} ${data.user.lastname}`);
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
            <p className='profile-username'>{name}</p>
            <div>
                <AddFriend isFriend={isFriend} setIsFriend={setIsFriend}/>
            </div>
            <div>
                <Unfriend isFriend={isFriend} setIsFriend={setIsFriend}/>
            </div>
            {localStorage.getItem('userId') === userId && <button onClick={handleEditProfile} className='edit-profile-image-btn'>Edit profile Image</button>}
            {isEditProfile && <UpdateProfile setIsEditProfile={setIsEditProfile} userImage={userImage} setUserImage={setUserImage}/>}
            <NewPost posts={posts} setPosts={setPosts} newPost={newPost} setNewPost={setNewPost} setPostImage={setPostImage}/>
            {<Posts posts={posts} isPending={isPending} setPosts={setPosts} />}

        </div>  
     );
}
 
export default MyProfile;