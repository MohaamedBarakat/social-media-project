import { useEffect, useState } from "react";
import photo from '../images/138675207_3988428944509572_4336521994899151105_o.jpg'
import NewPost from "./NewPost";
import Posts from "./Posts";
const Profile = () => {
    const [isEdit,setIsEdit] =useState(false);
    const [name,setName] = useState('');
    const [oldPassword,setOldPassword] = useState('');
    const [password,setPassword] = useState('');
    const [newPost,setNewPost] = useState('');
    const [postImage , setPostImage] = useState('');
    const [posts,setPosts] = useState([{}]);

    useEffect(()=>{
        fetch('http://localhost:4000/posts',{
            method:'GET',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res =>{
            return res.json();
        })
        .then(recivedPosts =>{
            setPosts(recivedPosts.posts.reverse());
            setName(recivedPosts.username);
            console.log(posts);
        }).catch(err => {
           
        })
    },[]);
    
    const handleIsEditProfile = () => {
        setIsEdit(true);
    }
    const handleClose = ()=>{
        setIsEdit(false);
    }
   
   
    
    return ( 
        <div className="profile">
            <div className='profile-image'>
                <img src={photo} alt="Photot" />
            </div>
            <p><b>{name}</b></p>

            <NewPost setPosts={setPosts} newPost={newPost} setNewPost={setNewPost} setPostImage={setPostImage}/>
            <Posts posts={posts} setPosts={setPosts} />

        </div>  
     );
}
 
export default Profile;