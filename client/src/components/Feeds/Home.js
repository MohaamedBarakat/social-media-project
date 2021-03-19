import {useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import NewPost from '../NewPost/NewPost';
import Posts from '../Posts/Posts';
import SearchBar from '../SearchBar/SearchBar';
import useFetchPost from '../useFeatchPost';
const Home = (props) => {
    const {postsData,userData,isPending,error} = useFetchPost(`http://localhost:4000/feeds`);

    const history = useHistory();
    useEffect(() => {
        history.push('/home');
    }, )
    return ( 
        <div className="home">
        <SearchBar searchInput={props.searchInput} setSearchInput={props.setSearchInput}/>
        <NewPost newPost={props.newPost} setNewPost={props.setNewPost} setPosts={props.setPosts} setPostImage={props.setPostImage}/>
        <Posts posts={postsData} isPending={isPending} setPosts={props.setPosts} userData={userData}/>
        </div>
     );
}
export default Home;