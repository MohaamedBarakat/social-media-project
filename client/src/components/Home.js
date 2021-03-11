import {useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import NewPost from './NewPost';
const Home = (props) => {
    const [newPost,setNewPost] = useState('');
    const history = useHistory();
    useEffect(() => {
        history.push('/home');
    }, )
    return ( 
        <div className="home">Welcome
        <NewPost newPost={props.newPost} setNewPost={props.setNewPost} setPosts={props.setPosts} setPostImage={props.setPostImage}/>
        </div>
     );
}
 
export default Home;