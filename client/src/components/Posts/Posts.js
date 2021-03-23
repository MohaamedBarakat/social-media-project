import { useEffect, useState } from "react";
import EditPost from "../EditPost/editPost";
import {Link, useHistory, useParams} from "react-router-dom";
import './Posts.css';
import PostHeader from "../PostHeader/PostHeader";

const Posts = ({posts,setPosts,isPending}) => {
    const [isEditPost,setIsEditPost] = useState(false);
    const [editPost,setEditPost] = useState('');
    const [postId , setPostId] = useState('');
    const [likes,setLikes] = useState([]);
    const [numOfLikes,setNumOfLikes] = useState([]);
    const [usersLikes,setUserLikes] = useState([]);
    const history = useHistory(); 
    const {userId} = useParams();
    //const [isPending,setIsPending] = useState(true);
    //console.log(postsData);
    //console.log(userData);
    //setUser(userData);
    /*if(!isPending){
        console.log('posts',postsData)
        setPosts(postsData);    
    }*/
    //setUser(userData);
    /*if(!isPending){
        let like = [];
            posts.map((post) => {
            //console.log('post1',post.likes);
            like.push( post.likes.includes(localStorage.getItem('userId')) );
            //console.log('post1',like);

            })
        setLikes(like); 
    }*/
    useEffect(() => {
        let numLikes = [];
        let like = [];
        //console.log(posts);
        posts.map((post) => {
            //console.log(post)
            like.push( post.likes.includes(localStorage.getItem('userId')) );
            numLikes.push(post.likes.length > 0 ? post.likes.length :0);
        })
        setLikes(like); 
        setNumOfLikes(numLikes);
        //console.log(likes,numOfLikes);
        //console.log(numOfLikes);
        console.log(posts);
    },[posts,isPending]);

    const handleLike = (postId,index) =>{
        console.log(postId,index);
        fetch(`http://localhost:4000/post/${postId}/like` ,{
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
            const likesOnPosts = [...likes];
            likesOnPosts[index] = like;
            setLikes(likesOnPosts);
            let numLikes = [...numOfLikes];
            numLikes[index] = like ? numLikes[index]+1 : numLikes[index]-1;
            setNumOfLikes(numLikes);
            console.log(index,numLikes,); 
        })
  
    }

    const handleComment = (postId) =>{
        history.push('/post/' + postId);
    }
    const handleUsersLikes = (postId) => {
        document.getElementById("num-likes-users").style.display ='block';
        fetch(`http://localhost:4000/users-likes/post/${postId}`,{
            method:'GET',
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
        })
        .then(res => {
            if(!res.ok){
                throw new Error('We could not pick users likes now');
            }
            return res.json();
        })
        .then(data => {
            setUserLikes(data.users);
            console.log(usersLikes);
        })
    }
    const handleClose = () => {
        document.getElementById("num-likes-users").style.display ='none';
    }
    return ( 
        <div className="posts" >
            {isPending && <div className='posts-loading'>Loading...</div>}
            {!isPending && posts.map( (post,index) =>
                <div className="post-details" key={post._id}>
                    <div>
                        {isEditPost && <EditPost setIsEditPost={setIsEditPost} editPost={editPost} setEditPost={setEditPost} postId={postId} posts={posts} setPosts={setPosts}/>}
                    </div>
                    <PostHeader post={post} user={post.creator} setEditPost={setEditPost} setIsEditPost={setIsEditPost} setPosts={setPosts} setPostId={setPostId}/>

                    <div className="content">
                        {post.content}
                    </div>
                    {post.image && <div className="post-image-content">
                       <Link to={'/'}><img className='post-image-image' src={`http://localhost:4000/${post.image}`}/></Link> 
                    </div>}
                    <div className="numLikes">
                        <button className='post-number-likes' onClick={() => handleUsersLikes(post._id)}>{numOfLikes[index] > 0 ?  `${numOfLikes[index]},  likes on your post`:''}</button>
                        <div className='likes-users' className='overlay' id='num-likes-users' style={{display:'none'}}>
                            <button className='handle-close' onClick={handleClose}>X</button>
                            { usersLikes.length >0 && usersLikes.map(user =>
                            <div className="like-users-content" key={user._id}>
                                <Link to={`/profile/${user._id}`}>
                                    <img className='likes-users-links-image' src={`http://localhost:4000/${user.image}`}/>
                                    <p className='likes-users-links-p'>{user.username}</p>
                                </Link>
                            </div>
                            )}
                        </div>
                    </div>
                    <div className="post-action">
                        {!likes[index] &&  <button className='action-on-post-like' onClick={() => handleLike(post._id,index)}>Like</button>}
                        {likes[index] &&  <button className='action-on-post-unlike' style={{backgroundColor:'lightblue'}}onClick={() => handleLike(post._id)}>Unlike</button>}
                        <button className='action-on-post-comment' onClick={() => handleComment(post._id)}>Comment</button>
                    </div>
                </div>
            )}

        </div>
     );
    }
export default Posts;   