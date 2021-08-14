import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import React, { useContext } from "react";
import Feeds from "./Components/Feeds";
import Header from "./Components/Header";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import Signup from "./Components/Signup";
import { AuthContext, AuthProvider } from "./Context/AuthProvider";
const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Header></Header>
          <Switch>
            <Route path="/login" component={Login} exact></Route>
            <Route path="/signup" component={Signup} exact></Route>
            {/* <Route path="/" component={Feeds} exact></Route> */}
            <PrivateRoute path="/" comp={Feeds} exact></PrivateRoute>
            <PrivateRoute path="/profile" comp={Profile} exact></PrivateRoute>
          </Switch>
        </Router>
      </div>
    </AuthProvider>
  );
};

function PrivateRoute(props) {
  let { comp: Component, path } = props;

  let { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  return currentUser ? ( // if user has some value
    <Route path={path} component={Component}></Route>
  ) : (
    <Redirect to="/login"></Redirect>
  );
}
export default App;
