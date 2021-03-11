const  NewPost= ({newPost,setNewPost,setPosts,setPostImage}) => {
    const handleNewPost = (e) => {
        e.preventDefault();
        console.log('helllo')
        fetch('http://localhost:4000/new-post',{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
            body:JSON.stringify({
                content:newPost
            })
        })
        .then(res => {
            console.log(newPost);
            return res.json();
        })
        .then(res =>{
            setPosts(res.posts.reverse());
            setNewPost('');
        })
        .catch(err => {
            console.log(err);
        })
    }
    return (  
        <div className="new-post">
            <form onSubmit = {handleNewPost}>
                <textarea   type="text"
                            value={newPost}
                            placeholder = "What's on your mind !"
                            onChange={(e) => setNewPost(e.target.value)}
                ></textarea>
                <input type='file'/>
                <button> Post !</button>
            </form>
        </div>
    );
}
 
export default NewPost;