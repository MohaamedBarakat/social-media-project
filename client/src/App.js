import Navbar from "./components/Navbar";
import { BrowserRouter as Router , Route ,Switch } from 'react-router-dom';
import Signup from "./components/Signup";
import { useState } from "react";
import StartPage from "./components/Start";
function App() {
  const [style ,setStyle] = useState({ 
    backgroundColor: '',
    width: '100%',
    height: '100vh'
   });
  return (
    <Router>
        <div style={style} >
              <Navbar />
          <div className="content" >
            <Switch>
              <Route exact path = "/">
                <StartPage />
              </Route>

              <Route path = "/register" >
                <Signup />
              </Route>

              <Route exact path = "/login">

              </Route>
            </Switch>
          </div>
        </div>
    </Router>
    
  );
}

export default App;
