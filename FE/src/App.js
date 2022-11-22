import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import NotFound from "./pages/404/404";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Messenger from "./pages/messenger/Messenger";
import { SocketContext, socket } from "./context/Socket";
import Form from "./pages/form-register/Form";
import FormSuccess from "./pages/form-register/FormSuccess";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Router>
        <Switch>
          <Route exact path="/">
            {user ? <Home /> : <Form />}
          </Route>
          <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
          <Route path="/register">
            {user ? <Redirect to="/" /> : <Form />}
          </Route>
          <Route path="/profile/:userId">
            {user ?
              <SocketContext.Provider value={socket}>
                <Profile />
              </SocketContext.Provider>
              : <Redirect to="/" />}
          </Route>
          <Route path="/verify-email/:verificationCode/:userId">
            {user ? <Redirect to="/" /> : <FormSuccess />}
          </Route>
          <Route path="/messenger">
            {!user ? <Redirect to="/" /> :
              <SocketContext.Provider value={socket}>
                <Messenger />
              </SocketContext.Provider>
            }
          </Route>
          {/* <Route path="/messenger/:userId">
            {!user ? <Redirect to="/" /> :
              <SocketContext.Provider value={socket}>
                <Messenger />
              </SocketContext.Provider>
            }
          </Route> */}
          <Route path="/not-found">
            <NotFound/>
          </Route>
        </Switch>
      </Router>
    </MuiPickersUtilsProvider>

  );
}

export default App;
