import {useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import NewPost from './NewPost/NewPost';
import SearchBar from './SearchBar/SearchBar';
const Home = (props) => {
    const [newPost,setNewPost] = useState('');
    const history = useHistory();
    useEffect(() => {
        history.push('/home');
    }, )
    return ( 
        <div className="home">
        <SearchBar searchInput={props.searchInput} setSearchInput={props.setSearchInput}/>
        <NewPost newPost={props.newPost} setNewPost={props.setNewPost} setPosts={props.setPosts} setPostImage={props.setPostImage}/>
        </div>
     );
}
 
export default Home;