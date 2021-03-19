import './PostHeader.css';
import {Link, useParams} from 'react-router-dom';
const PostHeader = ({post,user,setPostId,setPosts,setIsEditPost,setEditPost}) => {
    const {userId} = useParams();
    const handleDeletePost = (postId) => {
        console.log(userId);
        fetch(`http://localhost:4000/post/${postId}/user/${userId}`,{
            method:'DELETE',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res =>{
            if(!res.ok){
                throw new Error('could not delte this post');
            }
            return res.json();
        })
        .then(data =>{
            //console.log(data.posts);
            setPosts(data.posts);
            //console.log(data.message);
        })
        .catch(err =>{
            console.log(err);
        })
    }

    const handleEditPost = (postId) => {
        setIsEditPost(true);
        //console.log(postId);
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
            <div className="header">
                <img className='creator-image' src={`http://localhost:4000/${user.image}`}/>
                <Link to={`/profile/${post.creator._id}`}> {user.username} </Link><p> created At {new Date(post.updatedAt).toLocaleDateString('en-US')}</p>
                
                {localStorage.getItem('userId') === post.creator._id  && <button className="btn-delete-post" onClick={()=>{handleDeletePost(post._id)}}>X</button>}
                {localStorage.getItem('userId') === post.creator._id && <button className="btn-edit-post" 
                onClick={()=>{
                    handleEditPost(post._id);
                    setPostId(post._id);
                }}>...</button>}
            </div>
     );
}
 
export default PostHeader;