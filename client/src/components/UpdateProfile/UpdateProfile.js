import './UpdateProfile.css';
const UpdateProfile = (props) => {
    const formData = new FormData();
    formData.append('image',props.userImage);
    const handleEditProfile = (e) =>{
        e.preventDefault();
        fetch('http://localhost:4000/user/update-profile-image',
        {
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
            method:"PATCH",
            body:formData
        })
        .then(res =>{
            if(!res.ok){
                throw Error('unable to update photo');
            }
            props.setIsEditProfile(false);
        })
    }
    const handleClose = () => {
        props.setIsEditProfile(false);
    }
    return (  
        <div className="update-profile" className='overlay'>
            <button onClick={handleClose}>X</button>
            <form onSubmit={handleEditProfile}>
                <input  type='file'
                        onChange={e => props.setUserImage(e.target.files[0])}
                />
                <button>Update Profile Image</button>
            </form>
            
            
        </div>
    );
}
 
export default UpdateProfile;