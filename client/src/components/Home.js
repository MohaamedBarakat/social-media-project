import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
const Home = () => {
    const history = useHistory();
    useEffect(() => {
        history.push('/home');
    }, )
    return ( 
        <div className="home">Welcome</div>
     );
}
 
export default Home;