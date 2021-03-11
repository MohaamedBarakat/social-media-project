import { useEffect, useState } from "react";
import EditPost from "./editPost";

const Posts = ({posts,setPosts}) => {
    const [isEditPost,setIsEditPost] = useState(false);
    const [editPost,setEditPost] = useState('');
    const [username,setUsername] = useState('');
    const [postId , setPostId] = useState(''); 

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
        .then(recivedData =>{
            setPosts(recivedData.posts.reverse());
            setUsername(recivedData.username);
            //console.log(recivedData.username);
        })
        .catch(err => {
           console.log(err);
        })
    },[]);

    const handleDeletePost = (id) => {
        fetch('http://localhost:4000/post/'+id,{
            method:'DELETE',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res =>{
            return res.json();
        })
        .then(data =>{
            setPosts(data.posts.reverse());

        })
        //console.log(id);
    }

    const handleEditPost = (postId) => {
        setIsEditPost(true);
        console.log(postId);
        fetch('http://localhost:4000/post/'+postId,
        {
            method:'GET',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        }
        )
        .then(res =>{
            return res.json();
        })
        .then(data => {
            setEditPost(data.post.content);
        })
        .catch(err =>{
            console.log(err);
        })
        
    }
    return ( 
        <div className="posts">

            {!posts && <p>No posts</p>}
            {posts && posts.map((post) =>
            <div className="post-details" key={post._id}>
                {isEditPost && <EditPost setIsEditPost={setIsEditPost} editPost={editPost} setEditPost={setEditPost} postId={postId}/>}
                <p><b>{username} </b> created At {new Date(post.createdAt).toLocaleDateString('en-US')}</p>
                <button className="btn-delete-post" onClick={()=>{handleDeletePost(post._id)}}>X</button>
                
                <button className="btn-edit-post" 
                onClick={()=>{
                    handleEditPost(post._id);
                    setPostId(post._id);
                }}>...</button>

                <li>{post.content}</li>
            </div>
            )}
        </div>
     );
}
 
export default Posts;