import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import helper from '../../utils/main';
import CommentList from "../CommentList/CommentList";
import './SinglePost.css';
const SinglePost = (props) => {
    const {postId} = useParams();
    const [post,setPost] = useState({creator:{_id:null},likes:[]});
    const [postComment,setPostComment] = useState('');
    const [commentList,setCommentList] = useState([{creator:{image:''}}]);
    const [like,setLike] = useState(false);
    const [isPending,setIsPending] = useState(true);
    const [numLikes ,setNumLikes] = useState('');
    useEffect(() => {
        fetch('http://localhost:4000/post/' + postId , {
            method:'GET',
            headers :{
                Authorization :`Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res =>{
            if(!res.ok){
                throw Error('Can not fetch this post');
            }
            return res.json();
        })
        .then(data =>{
            console.log('is he like');
            //console.log(data.post.creator._id);
            setPost(data.post);
            const isLike = post.likes.includes(localStorage.getItem('userId'));
            console.log(isLike);
            //console.log(isLike);
            setLike(isLike);
            setNumLikes(post.likes.length >0 ? post.likes.length + ',  likes your post':'')
            setIsPending(false);

            //console.log(post.creator._id)
        }).catch(err =>{
            console.log(err);
        });
        fetch(`http://localhost:4000/post/${postId}/comment`,{
            method:'GET',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
            })
            .then(res =>{
                if(!res.ok){
                    throw new Error('Could not comment on this post please try again');
                }
                return res.json();
            })
            .then(data =>{
                console.log(data);
                //const newCommentList = [...commentList ,postComment];
                setCommentList(data.comments);
                setPostComment('');
            })        
    }
    ,[isPending])
    const handleCommentPost = (e) => {
        e.preventDefault();
        fetch(`http://localhost:4000/post/${postId}/comment`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
            body:JSON.stringify({
                commentMessage : postComment
            })
            })
            .then(res =>{
                if(!res.ok){
                    throw new Error('Could not comment on this post please try again');
                }
                return res.json();
            })
            .then(data =>{
                //console.log(data);
                //const newCommentList = [...commentList ,postComment];
                setCommentList(data.comments);
                setPostComment('');
            })
            .catch(err =>{
                console.log(err);
            })   
    }
    const handleLike = (id) => {
        console.log(id);
        fetch(`http://localhost:4000/post/${id}/like`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => {
                return res.json();
            })
            .then((data) => {
                const isLike = data.post.likes.includes(localStorage.getItem('userId'));
                setLike(isLike);
                //console.log(data.post.likes.length > 0 ? data.post.likes.length + ',  likes your post':'');
                setNumLikes(data.post.likes.length > 0 ? data.post.likes.length + ',  likes your post':'')
            })
    }
  
    return ( 
        <div className="single-post">
            {isPending && <p className='single-post-loading'>Loading...</p>}
           {!isPending &&<div className='single-post-details'>
            <div className="header">
                <img className='creator-image' src={`http://localhost:4000/${post.creator.image}`}/>
                <Link to={`/profile/${post.creator._id}`}>{post.creator.firstname+' '+post.creator.lastname}</Link><p> created At {new Date(post.createdAt).toLocaleDateString('en-US')}</p>
                {localStorage.getItem('userId') === post.creator._id &&<button className="btn-delete-post" onClick={()=>{helper.handleDeletePost(post._id)}}>X</button>}
                {localStorage.getItem('userId') === post.creator._id && <button className="btn-edit-post" onClick={()=>helper.handleEditPost(post._id)}>...</button>}

            </div>
            <div className="content">
                {post.content}
            </div>
            {post.image && <div className="image-content">
                <img className='post-image' src={`http://localhost:4000/${post.image}`}/>
            </div>
            }
            <div className="single-post-likes" style={{color:'white',fontWeight:'bold',margin:'1rem'}}>
                {numLikes}
                
            </div>
            <div className="comment-post">
                    {!like && <button className='comment-post-like' style={{backgroundColor:'white'}}onClick={() => handleLike(post._id)}>Like</button>}
                    { like && <button className='comment-post-unlike' style={{backgroundColor:'lightblue'}}onClick={() => handleLike(post._id)}>Unlike</button>}
                <form onSubmit={handleCommentPost}>
                    <textarea   value={postComment} 
                                onChange={(e)=>setPostComment(e.target.value)}
                                placeholder=' Write your comment here !!'
                                className='comment-post-text' />
                    <button className='comment-post-btn'>Comment !</button>
                </form>
            </div>
                <CommentList commentList={commentList} post={post} setCommentList={setCommentList}/>
                </div>}
        </div>
     );
}
 
export default SinglePost;