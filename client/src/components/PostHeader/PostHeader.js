import './PostHeader.css';
import {Link} from 'react-router-dom';
const PostHeader = ({post,user,setPostId,setPosts,setIsEditPost,setEditPost}) => {
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
            <div className="header">
                <img className='creator-image' src={`http://localhost:4000/${user.image}`}/>
                <Link to={`/profile/${post.creator}`}> {user.username} </Link><p> created At {new Date(post.createdAt).toLocaleDateString('en-US')}</p>
                
                {localStorage.getItem('userId') === post.creator  && <button className="btn-delete-post" onClick={()=>{handleDeletePost(post._id)}}>X</button>}
                {localStorage.getItem('userId') === post.creator && <button className="btn-edit-post" 
                onClick={()=>{
                    handleEditPost(post._id);
                    setPostId(post._id);
                }}>...</button>}
            </div>
     );
}
 
export default PostHeader;