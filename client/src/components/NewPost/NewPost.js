import { useState } from "react";
import { useParams } from "react-router";
import './NewPost.css'
const  NewPost= ({newPost,setNewPost,setPosts,setPostImage}) => {
    const {userId} = useParams();
    const [postClick,setPostClick] = useState(false);
    const [image,setImage] = useState();
    const formData = new FormData();
    const handleNewPost = (e) => {
        formData.append('content',newPost);
        formData.append('image',image);
        e.preventDefault();
        setPostClick(true);
        fetch(`http://localhost:4000/new-post/user/${userId||localStorage.getItem('userId')}`,{
            method:'PUT',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
            body:formData
        })
        .then(res => {
            console.log(newPost);
            return res.json();
        })
        .then(data =>{
            setPosts(data.posts);
            setNewPost('');
            setPostClick(false);
        })
        .catch(err => {
            console.log(err);
        })
    }
    return (  
        <div className="new-post">
            <form onSubmit = {handleNewPost}>
                <textarea   type="text"
                            className="new-post-textarea"
                            value={newPost}
                            placeholder = "What's on your mind !"
                            onChange={(e) => setNewPost(e.target.value)}
                    >
                </textarea>
                <input  type='file'
                        className="new-post-input"
                        onChange={(e)=> setImage(e.target.files[0])} />
                {postClick && <button className="new-post-btn" disabled style={{backgroundColor:'gray',border:'solid gray'}}> Post !</button>}
                {!postClick && <button className="new-post-btn"> Post !</button>}
            </form>
        </div>
    );
}
 
export default NewPost;