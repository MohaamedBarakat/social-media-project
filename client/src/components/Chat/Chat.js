import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import openSocket from 'socket.io-client';
import './Chat.css';
const Chat = () => {
    const styles = {
        chat:{
            width:'100%',
            height:'100%',
            backgroundColor:'white',
            margin:'0 0 0 0',
            zIndex:1,
            position:'fixed',
            position:'absolute',
            left:0
            
        },
        chatUsers:{
            width:'30%',
            height:'100%',
            backgroundColor:'rgb(1, 1, 32)',
            display:'inline-block',
            margin:'0 0 0 0',
            zIndex:2,
            overflowY:'scroll',
            position:'fixed',
            position:'absolute',
            left:0
        },
        chatMessage:{
            width:'70%',
            height:'100%',
            margin:'0rem 0 0 36rem',
            backgroundColor:'rgb(1, 1, 32)',
            display:'inline-block',
            zIndex:2,
            position:'fixed',
            position:'absolute',
            left:0
        },
        chatFriends:{
            display:'flex',
            flexWrap:'wrap',
        },
        userChatButton:{
            backgroundColor:'transparent',
            outline:'none',
            width:'100%',
            border:'none',
            cursor:'pointer',
        },
        userImage:{
            width:'40px',
            height:'40px',
            borderRadius:'100%',
            border:'0.2rem solid transparent',
            margin:'1rem 0rem 0rem -30rem',
            display:'inline-block',
            overflow:'hidden',
            
        },
        userName:{
            color:'white',
            fontWeight:'bold',
            fontSize:'1rem',
            display:'inline-block',
            position:'absolute',
            margin:'2rem 0rem 0rem 0.5rem'
        },
        lastMessage:{  
            fontWeight:350,
            margin:'-0.4rem 0 0 -24rem',
            color:'black'

        },
        hr:{
            margin:'1rem',
            width:'95%',
            margin:'auto',
            color:'white'
        },
        messageContent:{
            width:'85%',
            height:'60%',
            backgroundColor:'rgb(200, 200, 200, 0.2)',
            overflowY:'scroll',
            margin:'1rem auto',
            padding:'2rem',
            borderRadius:'0.5rem'
        },
        chatMessageTyping:{
            display:'block'
        },
        chatMessageInput:{
            width:'40rem',
            height:'2rem',
            borderRadius:'5rem',
            outline:'none',
            marginLeft:'4rem',
            padding:'1rem',
            display:'inline-block',
            resize:'none',
            backgroundColor:'rgb(200, 200, 200,0.2)',
            color:'white',
            fontWeight:'bold'
        },
        chatMessageButton:{
            display:'inline-block',
            width:'5rem',
            height:'4rem',
            borderRadius:'100%',
            backgroundColor:'#f1356d',
            color:'white',
            fontWeight:'bold',
            cursor:'pointer',
            position:'absolute',
            margin:'1rem 0 0 -0.5rem',
            outline:'none',
            border:'none'
        },
        chatImage:{
            display:'inline-block',
            width:'25px',
            height:'25px',
            overflow:'hidden',
            borderRadius:'100%'
        },
        chatMessageDiv:{
            display:'inline-block',
            margin:'0.5rem 0 0 1rem',
            width:'auto',
            padding:'0.5rem',
            backgroundColor:'gray',
            borderRadius:'2rem'

        },
        chatImageHeader:{
            display:'inline-block',
            width:'40px',
            height:'40px',
            overflow:'hidden',
            borderRadius:'100%',
            margin:'1rem'
        },
        chatUsernameHeader:{
            display:'inline-block',
            fontWeight:'bold',
            position:'absolute',
            margin:'1.6rem 0 0 0',
            color:'white'

        }
    }
    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState('');
    const [friends,setFriends] = useState([]);
    const [username,setUsername] = useState('');
    const [userimage,setUserimage] = useState('');
    const {chatIdParam} = useParams();
    const history = useHistory();
    const handleMessageSubmit = (e) =>{
        e.preventDefault();
        fetch(`http://localhost:4000/chat/${chatIdParam}`,{
            method:'PUT',
            headers:{
                Authorization : `Bearer ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({message:message})
        })
        .then(res => {
            if(!res.ok){
                throw new Error('could not fetch users now');
            }
            return res.json();
        })
        .then(data => {
            setMessages(data.chat.messages);
            setMessage('');
        })
    };
    const handleGetChat = (chatId,userImage,userUsername) => {
        history.push(`/chat/${chatId}`);
        setUserimage(userImage);
        setUsername(userUsername);
        fetch(`http://localhost:4000/chat/${chatId}`,{
            method:'GET',
            headers:{
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if(!res.ok){
                throw new Error('could not fetch users now');
            }
            return res.json();
        })
        .then(data => {
            setMessages(data.chat.messages);
        })
    };
    useEffect(() => {
        fetch('http://localhost:4000/chat/users',{
            method:'GET',
            headers:{
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if(!res.ok){
                throw new Error('could not fetch users now');
            }
            return res.json();
        })
        .then(data => {
            setFriends(data.userFriends);
        })
        if(chatIdParam){
            const socket = openSocket('http://localhost:4000');
            socket.on(chatIdParam.toString() , data => {
                setMessages(data.chat.messages);
            })
        }
    },[chatIdParam])
    return ( 
        <div className="chat" style={styles.chat}>
            <div className="chat-users" style={styles.chatUsers}>
                <div className="chat-users-friends" style={styles.chatFriends}>
                    {friends.map(friend =>
                        <button style={styles.userChatButton} key={friend._id} onClick={() => handleGetChat(friend.chatId._id,friend.userId.image,friend.userId.firstname+' '+friend.userId.lastname)}>
                            <img src={`http://localhost:4000/${friend.userId.image}`} style={styles.userImage} />
                            <p style={styles.userName}>{`${friend.userId.firstname} ${friend.userId.lastname}`}</p>
                            <p style={styles.lastMessage}>hello</p>
                            <hr style={styles.hr} />
                        </button>
                        )}
                </div>
            </div>

            <div className="chat-message" style={styles.chatMessage}>
                <div>
                    {userimage !== '' && <img src={`http://localhost:4000/${userimage}`} style={styles.chatImageHeader} />}
                    {<div style={styles.chatUsernameHeader}>{username}</div>}
                </div>
                <div className="chat-message-content" style={styles.messageContent}>
                    {messages.length > 0 && messages.map(message => 
                        <div>
                            <img src={`http://localhost:4000/${message.userId.image}`} style={styles.chatImage}/>
                            <div style={styles.chatMessageDiv}>{message.message}
                        </div>
                    </div>
                    )}
                </div>

                <form onSubmit={handleMessageSubmit}>
                    {chatIdParam &&<textarea style={styles.chatMessageInput} value={message} onChange={(e)=>setMessage(e.target.value)}/>}
                    {chatIdParam &&<button style={styles.chatMessageButton}>Send</button>}
                </form>
            
            </div>
            
        </div>
     );
}
 
export default Chat;