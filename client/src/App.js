import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router , Route ,Switch,useHistory } from 'react-router-dom';
import Signup from "./components/Signup/Signup";
import StartPage from "./components/Start";
import Login from "./components/Login/Login";
import Home from "./components/Home";
import SinglePost from "./components/SinglePost/SinglePost"
import { useState,useEffect } from "react";
import Profile from "./components/Profile/Profile";
import PageNotFound from "./components/PageNotFound";

function App() {
  const [isAuth , setIsAuth] = useState(false);
  const [newPost , setNewPost] = useState('');
  const [postImage , setPostImage] = useState('');
  const [posts , setPosts] = useState([{}]);
  const [searchInput,setSearchInput] =useState('');
  const history = useHistory();
  useEffect(() => {
    if(localStorage.getItem('userId') !== null){
      setIsAuth(true);
    }else {
      setIsAuth(false);    }
      
  })
  return (
    <Router>
        <div className='app' >
              <Navbar isAuth={isAuth} setIsAuth={setIsAuth}  />
          <div className="content" >
            <Switch>

              <Route exact path = "/">
                <StartPage />
              </Route>

              <Route exact path = "/register" >
                <Signup />
              </Route>

              <Route exact path = "/login">
                <Login setIsAuth={setIsAuth}/>
              </Route>

              <Route exact path = "/home">
                <Home newPost={newPost} setNewPost={setNewPost} setPosts={setPosts} setPostImage={setPostImage} searchInput={searchInput} setSearchInput={setSearchInput}/>
              </Route>

              <Route exact path = "/profile/:userId">
                <Profile />
              </Route>
              
              <Route  exact path = "/post/:postId">
                <SinglePost />
              </Route>


              <Route path="*">
                <PageNotFound />
              </Route>

              

            </Switch>
          </div>
        </div>
    </Router>
    
  );
}

export default App;
