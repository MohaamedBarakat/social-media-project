import { useState } from 'react';
import {Link} from 'react-router-dom';
import './SearchBar.css';
const SearchBar = ({searchInput,setSearchInput}) => {
    const [users , setUsers] = useState([{_id:'',username:''}]); 
    const handleSearch = (e) => {
            e.preventDefault();
            setSearchInput(e.target.value);
            //console.log(searchInput);
            if(searchInput.length > 0){
                document.getElementById("search-bar-link").style.display ='block';
                document.getElementById("search-result").style.display ='block';
                fetch('http://localhost:4000/users/search',{
                    method:'POST',
                    body:JSON.stringify({users:searchInput}),
                    headers:{
                        'Content-Type':'application/json',
                        Authorization:`Bearer ${localStorage.getItem('token')}`
                    }
    
                })
                .then(res =>{
                    return res.json();
                })
                .then(usersData=>{
                    setUsers(usersData.users);
                    console.log(usersData.users);
                })  
                .catch(err =>{
                    console.log(err);
                })
    
            }else{
                document.getElementById("search-bar-link").style.display ='none';
                document.getElementById("search-result").style.display ='none';
            }
          
    }
    const handleExitSearch = () => {
        document.getElementById("search-bar-link").style.display ='none';
        document.getElementById("search-result").style.display ='none';

        
        setSearchInput('');


    }
    return ( 
        
        <div className="search">
            
            <input type='text'
                    value={searchInput}
                    onChange={handleSearch}
                    className='search-input'
                    placeholder="Search for users"
                    />
            <div className="search-result" id='search-result' style={{display:'none'}}>
                <button className='exit-search' onClick={handleExitSearch}>X</button>
                <div id='search-bar-link' style={{display:'none'}}> 
                    {users.map(user =>

                        <li key={user._id}><Link style={{textDecoration:'none'}} to={`/profile/${user._id}`}><img className='search-bar-image' src={`http://localhost:4000/${user.image}`}/><p className='search-bar-p'>{user.username}</p></Link></li>
                            )
                    }
                    
                </div>
            </div>
            
            
        </div>
     );
}
 
export default SearchBar;