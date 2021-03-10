import { useState } from "react";
import photo from '../images/138675207_3988428944509572_4336521994899151105_o.jpg'
const Profile = () => {
    const [isEdit,setIsEdit] =useState(false);
    const [name,setName] = useState('');
    const [oldPassword,setOldPassword] = useState('');
    const [password,setPassword] = useState('');
    const [newPost,setNewPost] = useState('');
    const [postImage , setPostImage] = useState('');
    const handleNewPost = () => {
        fetch('url',{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
            body:JSON.stringify()
        })
        .then(res => {

        })
        .catch(err => {

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

                <button>Post!</button>

                </form>
            </div>

            <div className="post">
                No posts  
            </div>
        </div>
     );
}
 
export default Profile;