import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, FormControl, InputLabel, Input } from '@material-ui/core'
import Message from './Message';
import FlipMove from 'react-flip-move'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import axios from './axios.js';
import Pusher from 'pusher-js';

const pusher = new Pusher('33ee0bbb9df78837c49e', {
  cluster: 'ap2'
});


function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')


  //fetching from localhost 9000
  const sync = async() => {
    await axios.get('/retrieve/conversation')
    .then((res) => {
      // console.log(res.data);
      setMessages(res.data)
    })
  }

  useEffect(() => {
    sync()
  },[])

  useEffect(() => {
    const channel = pusher.subscribe('messages');
    channel.bind('newMessages', function(data) {
      // alert(JSON.stringify(data));
      console.log(data)  //TODO: data here is sending me the actual changes I should push this to setMessages to make it efficient
      sync() //by doing this we are reloading the app
    });
  },[username])

  useEffect(() => {
    setUsername(prompt('Please enter your name'))
  }, [])

  const sendMessage = (e) => {
    e.preventDefault()

    axios.post('/save/message', {
      username: username,
      message: input,
      timestamp: Date.now(),
    })

    setInput('')
  }

  return (
    <div className="App">
      <img src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100" alt="messenger logo" />
      <h2>Welcome {username}</h2>

      <form className='app__form' >
        <FormControl className='app__formControl' >
          <Input className='app__input' placeholder='Enter a message...' value={input} onChange={(e) => setInput(e.target.value)} />
          <IconButton className='app__iconButton' variant='text' color='primary' disabled={!input} onClick={sendMessage} type="submit" >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>

      <FlipMove>
        {
          messages.map( message => (
            <Message key={message._id} message={message} username={username} />
          ))
        }
      </FlipMove>
    </div>
  );
}

export default App;
