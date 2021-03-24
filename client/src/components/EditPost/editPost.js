import { useState } from "react";

const EditPost = ({editPost,setEditPost,setIsEditPost,postId,posts,setPosts}) => {
    const [image , setImage] = useState();
    const formData = new FormData();
    const handleClose = ()=>{
        setIsEditPost(false);
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        //console.log(postId);
        formData.append('content',editPost);
        formData.append('image',image);
        fetch('http://localhost:4000/post/' + postId , {
            method:'PATCH',
            body : formData,
            headers :{
                Authorization :`Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res =>{
                if(!res.ok){
                    throw new Error('an error occured');
                }
               const newPosts = posts.map(post =>{
                    if(postId === post._id){
                        post.content = editPost;
                    }
                    return post;
                })
                //console.log(newPosts);
                setPosts(newPosts);
                setIsEditPost(false);

            })
    }
    return ( 
        <div className="overlay">
        
            <button onClick={handleClose} className='close-edit-post'>X</button>
            <label>Edit Post</label>
            <form onSubmit={handleSubmit}>
                <textarea   onChange={(e) => setEditPost(e.target.value)}
                            value={editPost}
                            className='textarea-edit-post'

                />
                <input  type='file'
                        className="new-post-input"
                        onChange={(e)=> setImage(e.target.files[0])} />
                
                <button className='button-edit-post'>Update Post</button>
            </form>
        
        
        </div>
     );
}
 
export default EditPost;