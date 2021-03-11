import Navbar from "./components/Navbar";
import { BrowserRouter as Router , Route ,Switch } from 'react-router-dom';
import Signup from "./components/Signup";
import StartPage from "./components/Start";
import Login from "./components/Login";
import Home from "./components/Home";
import { useState,useEffect } from "react";
import Profile from "./components/Profile";
import PageNotFound from "./components/PageNotFound";

function App() {
  const [isAuth , setIsAuth] = useState(false);
  const [token , setToken] = useState(null);
  const [userId , setUserId]=useState(null);
  const [isEdit , setIsEdit] =useState(false);
  const [name , setName] = useState('');
  const [oldPassword , setOldPassword] = useState('');
  const [password , setPassword] = useState('');
  const [confirmPassword , setConfirmPassword] = useState('');
  const [newPost , setNewPost] = useState('');
  const [postImage , setPostImage] = useState('');
  const [posts , setPosts] = useState([{}]);
  const [email , setEmail] = useState('');
  const [error , setError] = useState(null);
  const [isEditPost , setIsEditPost] = useState(false);
  const [editPost , setEditPost] = useState('');
  const [username , setUsername] = useState('');
  const [postId , setPostId] = useState(''); 
  const [isPending , setIsPending] = useState(false);
  //const history = useHistory();
  
  useEffect(() => {
    //history.go(0);
    //console.log(isAuth,token,userId);
    setUserId(localStorage.getItem('userId'));
    setToken(localStorage.getItem('token'));
    if(userId){
      setIsAuth(true);
      fetch('http://localhost:4000/user/' + userId,{
        method:'GET',
        headers:{
          'Authorization':'Bearer ' + token
        }
      })
    }
  },[userId,isAuth,token]);
    
    
  
  return (
    <Router>
        <div className='app' >
              <Navbar isAuth={isAuth} setIsAuth={setIsAuth} setToken={setToken} setUserId={setUserId} />
          <div className="content" >
            <Switch>

              <Route exact path = "/">
                <StartPage />
              </Route>

              <Route exact path = "/register" >
                <Signup />
              </Route>

              <Route exact path = "/login">
                <Login setIsAuth={setIsAuth} setToken={setToken} setUserId={setUserId}/>
              </Route>

              <Route exact path = "/home">
                <Home newPost={newPost} setNewPost={setNewPost} setPosts={setPosts} setPostImage={setPostImage}/>
              </Route>

              <Route exact path = "/profile">
                <Profile />
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
