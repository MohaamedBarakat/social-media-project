const EditPost = ({editPost,setEditPost,setIsEditPost,postId}) => {

    const handleClose = ()=>{
        setIsEditPost(false)
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(postId);
        fetch('http://localhost:4000/post/' + postId , {
            method:'PATCH',
            body : JSON.stringify({content : editPost}),
            headers :{
                'Content-Type' :'application/json',
                Authorization :`Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res =>{
                console.log('OK')
            })
    }
    return ( 
        <div className="overlay">
        
            <button onClick={handleClose} className='close-edit-post'>X</button>

            <form onSubmit={handleSubmit}>
                <label>Edit Post</label>
                <textarea   onChange={(e) => setEditPost(e.target.value)}
                            value={editPost}
                            className='textarea-edit-post'

                >
                </textarea>
                <button className='button-edit-post'>Update Post</button>
            </form>
        
        
        </div>
     );
}
 
export default EditPost;