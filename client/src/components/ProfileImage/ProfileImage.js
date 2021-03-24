import './ProfileImage.css';
const ProfileImage = ({userImage}) => {
    return ( 
        <div className='profile-image' style={{ margin:'1rem auto', 
                                        width:'200px',
                                        height:'200px',
                                        borderRadius:'100%',}}>
                {userImage!=='' && <img className='profile-image-source-image' style={{ 
                                                                                        width:'200px',
                                                                                        height:'200px',
                                                                                        border:'0.2rem solid rgb(216,216,216)',
                                                                                        borderRadius:'100%',
                                                                                        }} src={`http://localhost:4000/${userImage}`} alt="Photot" />}
        </div>
     );
}
 
export default ProfileImage;