import { useEffect } from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'


import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import Message from './pages/message'

import Alert from './components/alert/Alert'
import Header from './components/header/Header'
import StatusModal from './components/StatusModal'

import { useSelector, useDispatch } from 'react-redux'
import { refreshToken } from './redux/actions/authAction'
import { getPosts } from './redux/actions/postAction'
import { getSuggestions } from './redux/actions/suggestionsAction'

import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import SocketClient from './SocketClient'

import { getNotifies } from './redux/actions/notifyAction'
import Post from './pages/post/Post'
import Profile from './pages/profile/Profile'
import Conversation from './pages/message/Conversation'
import NotFound from './components/NotFound'
import Discover from './pages/discover'

function App() {
  const { auth, status, modal,} = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshToken())

    const socket = io()
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
    return () => socket.close()
  },[dispatch])

  useEffect(() => {
    if(auth.token) {
      dispatch(getPosts(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token])

  
  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {}
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {}
      });
    }
  },[])



  return (
    <Router>
      <Alert />

      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">
          {auth.token && <Header />}
          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          <Switch>
            <Route exact path="/" component={auth.token ? Home : Login} />
            <Route exact path="/login" component={Login}/>
            <Route exact path="/register" component={Register} />
            <Route exact path="/discover" component={auth.token ? Discover : Login} />
            <Route exact path="/message" component={auth.token ? Message : Login } />
            <Route exact path="/post/:id" component={auth.token ? Post : Login} />
            <Route exact path="/profile/:id" component={auth.token ? Profile : Login } />
            <Route exact path="/message/:id" component={auth.token ? Conversation : Login } />
            <Route  component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
