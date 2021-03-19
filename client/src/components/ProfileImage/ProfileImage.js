import './ProfileImage.css';
const ProfileImage = ({userImage}) => {
    return ( 
        <div className='profile-image' >
                {userImage!=='' && <img src={`http://localhost:4000/${userImage}`} alt="Photot" />}
        </div>
     );
}
 
export default ProfileImage;