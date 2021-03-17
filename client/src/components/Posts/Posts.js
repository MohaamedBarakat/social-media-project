import { useEffect, useState } from "react";
import EditPost from "../EditPost/editPost";
import {Link, useHistory, useParams} from "react-router-dom";
import './Posts.css';
import PostHeader from "../PostHeader/PostHeader";
const Posts = ({posts,setPosts}) => {
    const [isEditPost,setIsEditPost] = useState(false);
    const [editPost,setEditPost] = useState('');
    const [user,setUser] = useState({username:'',image:''});
    const [postId , setPostId] = useState('');
    const [likes,setlikes] =useState([]);
    const history = useHistory(); 
    const {userId} = useParams();

    useEffect(()=>{
        fetch('http://localhost:4000/posts/'+userId,{
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
            let like = [];
            posts.map((post,index) => {
               like.push( post.likes.includes(localStorage.getItem('userId')) );
            })
            //console.log(like);
            setlikes(like);
            //console.log(likes);
            setUser(recivedData.user);
        })
        .catch(err => {
           console.log(err);
        })
    },[posts]);

    const handleLike = (id) =>{
        console.log(id);
        fetch('http://localhost:4000/post/' + id + '/like' ,{
            method:'POST',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            return res.json();
        })
        .then((data) =>{
            const like = data.post.likes.includes(localStorage.getItem('userId'));
        })
  
    }

    const handleComment = (postId) =>{
        history.push('/post/' + postId);
    }
   
    const isLike = (userId) => {
        return localStorage.getItem('userId') === userId;
    }
    return ( 
        <div className="posts" >
            {posts && posts.map( (post,index) =>
                <div className="post-details" key={post._id}>
                    <div>
                        {isEditPost && <EditPost setIsEditPost={setIsEditPost} editPost={editPost} setEditPost={setEditPost} postId={postId} posts={posts} setPosts={setPosts}/>}
                    </div>
                    <PostHeader post={post} user={user} setEditPost={setEditPost} setIsEditPost={setIsEditPost} setPosts={setPosts} setPostId={setPostId}/>

                    <div className="content">
                        {post.content}
                    </div>
                    {post.image && <div className="post-image-content">
                       <Link to={'/'}><img className='post-image-image' src={`http://localhost:4000/${post.image}`}/></Link> 
                    </div>}
                    <div className="post-action">
                        {!likes[index] &&  <button className='action-on-post-like' onClick={() => handleLike(post._id)}>Like</button>}
                        { likes[index] &&  <button className='action-on-post-unlike' style={{backgroundColor:'lightblue'}}onClick={() => handleLike(post._id)}>Unlike</button>}
                        <button className='action-on-post-comment' onClick={() => handleComment(post._id)}>Comment</button>
                    </div>
                </div>
            )}

        </div>
     );
}
 
export default Posts;