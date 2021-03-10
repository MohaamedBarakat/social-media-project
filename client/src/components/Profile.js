import { useEffect, useState } from "react";
import photo from '../images/138675207_3988428944509572_4336521994899151105_o.jpg'
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
            console.log(posts);
        }).catch(err => {
           
        })
    },[]);
    const handleNewPost = (e) => {
        e.preventDefault();
        console.log(newPost);
        fetch('http://localhost:4000/new-post',{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
            body:JSON.stringify({
                content:newPost
            })
        })
        .then(res => {
            return res.json();
        })
        .then(res =>{
            setPosts(res.post.reverse());
        })
        .catch(err => {
            console.log(err);
        })
    }
    const handleIsEditProfile = () => {
        setIsEdit(true);
    }
    const handleClose = ()=>{
        setIsEdit(false);
    }
    const handleEditProfile = (e) => {
        e.preventDefault();
        
    }
    const handleDeletePost = (id) => {
        fetch('http://localhost:4000/'+id,{
            method:'DELETE',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res =>{
            return res.json();
        })
        .then(data =>{
            setPosts(data.post.reverse())
        })
        console.log(id);

    }
    return ( 
        <div className="profile">
            <div>
                <img src={photo} alt="Photot" className="profile-image" />
            </div>
            {isEdit && <div className="overlay">
            <button className="close-update" onClick={handleClose}>X</button>
                <div className="content">
                    <form onSubmit={handleEditProfile}>
                        <label>Name</label>
                        <input  type="text" 
                                value={name} 
                                onChange={(e)=>setName(e.target.value)}/>
                        <label>Old Password</label>
                        <input  type="text"
                                value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
                        <label>New Password</label>
                        <input  type="text"
                                value={password} 
                                onChange={(e)=>setPassword(e.target.value)}/>
                        <button className="update-profile">Update Profile</button>
                    </form>
                 </div>  
            </div>}

            <div>
            <button className="edit-profile" onClick={handleIsEditProfile}>Edit profile</button>
            </div>
            <div className="new-post">

                <form onSubmit = {handleNewPost}>

                <textarea className='status' type="text"
                        value={newPost}
                        placeholder = "What's on your mind !"
                        onChange={(e) => setNewPost(e.target.value)}
                
                />
                <input className='file' type="file" onChange={(e) => setPostImage(e.target.files[0])} />

                <button>Post !</button>

                </form>


                {!posts && <p>No posts</p>}

                {posts && posts.map( (post) =>
                <div className="post-content" key={post._id}>
                        <button className="btn-edit-post">...</button>
                        <button className="btn-delete-post" onClick={()=>{handleDeletePost(post._id)}}>X</button>
                        <p>{post.createdAt}</p>
                        <li>{post.content}</li>
                </div>
                )}
            </div>

        </div>
     );
}
 
export default Profile;