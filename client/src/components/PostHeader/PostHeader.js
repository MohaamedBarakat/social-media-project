import './PostHeader.css';
import {Link, useParams} from 'react-router-dom';
const PostHeader = ({post,user,setPostId,setPosts,setIsEditPost,setEditPost}) => {
    const {userId} = useParams();
    const styles = {
buttonHeader:{  display:'inline-block',
                backgroundColor:'gray',
                color:'black',
                float:'',
                borderRadius:'0.5rem',
                border:'none',
                cursor:'pointer',
                fontWeight:'bold',
                                   }}
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
    const handleStar = (postId) => {
        fetch(`http://localhost:4000/start/post/${postId}`,{
            method:'PUT',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if(!res.ok){
                throw new Error('colud not star this post now please try agai later');
            }
            return res.json();
        })
        .then(data => {
            document.getElementById('star').display='none';
            document.getElementById('unstar').display='block';
        })
    }
    return ( 
            <div className="header">
                <img className='creator-image' src={`http://localhost:4000/${user.image}`}/>
                <Link to={`/profile/${post.creator._id}`}> {`${user.firstname} ${user.lastname}`} </Link><p> created At {new Date(post.updatedAt).toLocaleDateString('en-US')}</p>
                {/*!post.creator.stars.includes(post._id) &&  <button id='star' style={styles.buttonHeader} onClick={() => handleStar(post._id)}>Star</button>*/}
                {/*post.creator.stars.includes(post._id) && <button id='unstar' style={styles.buttonHeader} onClick={() => handleStar(post._id)}>UnStar</button>*/}
                {localStorage.getItem('userId') === post.creator._id  && <button  className="btn-delete-post" onClick={()=>{handleDeletePost(post._id)}}>X</button>}
                {localStorage.getItem('userId') === post.creator._id && <button   className="btn-edit-post" 
                onClick={()=>{
                    handleEditPost(post._id);
                    setPostId(post._id);
                }}>...</button>}
                
            </div>
     );
}
 
export default PostHeader;