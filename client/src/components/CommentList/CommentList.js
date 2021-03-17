import {Link} from 'react-router-dom';
const CommentList = ({commentList,post,setCommentList}) => {
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
    const handleEditComment = () =>{}
    return ( 
        <div className="comment-list">
             {commentList && commentList.map(comment =>
                 <div className="comment-details"  key={comment._id}>
                    <Link to={`/profile/${comment.creator._id}`}>{comment.creator.username}</Link>
                    <div className="comment-details-manipulation">
                        {localStorage.getItem('userId') === comment.creator._id && <button className="btn-edit-comment" onClick={()=>handleEditComment(post._id)}>...</button>}
                        {(localStorage.getItem('userId') === comment.creator._id || localStorage.getItem('userId') === post.creator._id)  && <button className="btn-delete-comment" onClick={()=>{handleDeleteComment(post._id,comment._id)}}>X</button>}
                    </div>
                    <p>{comment.message}</p>
                </div>
             )}
           
        </div>
     );
}
 
export default CommentList;