import { useState } from 'react';
import {Link} from 'react-router-dom';
import './CommentList.css';
const CommentList = ({commentList,post,setCommentList}) => {
    const [updateComment , setUpdateComment] = useState();
    const handleDeleteComment = (postId,commentId) =>{
        //console.log('comment ',commentId);
        fetch(`http://localhost:4000/post/${postId}/comment/${commentId}`,{
            method:'DELETE',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            setCommentList(data.comments);
        })
    }
    const handleEditComment = (commentMessage) =>{
        setUpdateComment(commentMessage);
        document.getElementById("comment-list-details-text-edit").style.display ='block';
        document.getElementById("comment-list-details-btn-edit").style.display ='block';
        document.getElementById("comment-list-details-btn-cancel-edit").style.display ='block';
        document.getElementById("comment-list-details-message").style.display ='none';

    }
    const handleCancelEdit = () =>{
        setUpdateComment('');
        document.getElementById("comment-list-details-text-edit").style.display ='none';
        document.getElementById("comment-list-details-btn-edit").style.display ='none';
        document.getElementById("comment-list-details-btn-cancel-edit").style.display ='none';
        document.getElementById("comment-list-details-message").style.display ='block';
    }
    const handleUpdateComment = (postId,commentId) =>{
        fetch(`http://localhost:4000/edit-comment/post/${postId}/comment/${commentId}`,{
            method:'PATCH',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`,
                "Content-Type":"application/json"
            },
            body : JSON.stringify({commentMessage : updateComment})
        })
        .then(res => {
            if(!res.ok){
                throw new Error('Could not edit comment!');
            }
            return res.json();
        })
        .then(data =>{
            setCommentList(data.comments);
        })
        .catch(err => {
            console.log(err);
        });
        document.getElementById("comment-list-details-text-edit").style.display ='none';
        document.getElementById("comment-list-details-btn-edit").style.display ='none';
        document.getElementById("comment-list-details-btn-cancel-edit").style.display ='none';
        document.getElementById("comment-list-details-message").style.display ='block';
    }
    return ( 
        <div className="comment-list">
             {commentList && commentList.map(comment =>
                 <div className="comment-list-details"  key={comment._id}>
                     <img className='comment-list-details-image' src={`http://localhost:4000/${comment.creator.image}`}/>
                    <Link className='comment-list-details-link' to={`/profile/${comment.creator._id}`}>{`${comment.creator.firstname} ${comment.creator.lastname}`}</Link>
                    {localStorage.getItem('userId') === comment.creator._id && <button className="comment-list-details-edit-btn" onClick={()=>handleEditComment(comment.message)}>...</button>}
                    {(localStorage.getItem('userId') === comment.creator._id || localStorage.getItem('userId') === post.creator._id)  && <button className="comment-list-details-delete-btn" onClick={()=>{handleDeleteComment(post._id,comment._id)}}>X</button>}
                    <p className='comment-list-details-message' id='comment-list-details-message'>{comment.message}</p>
                    <textarea className='comment-list-details-text-edit' id='comment-list-details-text-edit' style={{display:'none'}} value={updateComment} onChange={(e)=>setUpdateComment(e.target.value)}/>
                    <button className='comment-list-details-btn-edit' id='comment-list-details-btn-edit' style={{display:'none'}} onClick={() => handleUpdateComment(post._id,comment._id)}>Update!</button>
                    <button className='comment-list-details-btn-cancel-edit' id='comment-list-details-btn-cancel-edit' style={{display:'none'}} onClick={handleCancelEdit}>Cancel!</button>


                </div>
             )}
           
        </div>
     );
}
 
export default CommentList;