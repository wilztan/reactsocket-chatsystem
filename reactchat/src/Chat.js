import React, { Component } from 'react';
import logo from './logo.svg';
import './Chat.css';

import socketIOClient from 'socket.io-client';
import $ from 'jquery'

const url = 'http://127.0.0.1:4001';
const socket = socketIOClient(url);



class MessageBar extends Component {
  constructor(props) {
    super(props)
  }
  render(){
    const {user,message,time,position} = this.props;
    return(
      <div className={position==0? "message-friend" : "message-me"}>
        <div className="messageBubble">
          <div className="buble-username">{user}</div>
          <div className="buble-message">{message}</div>
          <small >{time}</small>
        </div>
      </div>
    )
  }
}

class App extends Component {
  constructor(){
    super();
    this.state={
      user:'',
      logged:0,
      chatList:[],
      message:'',
    };
    this.send = this.send.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleMessageEvent=this.handleMessageEvent.bind(this);
    this.handleUserName = this.handleUserName.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount(){
    this.handleMessageEvent();
  }

  handleLogin(e){
    e.preventDefault();
    this.setState({logged:1});
  }

  handleLogout(){
    this.setState({logged:0});
  }

  handleMessageEvent(){
      socket.on('message',(msg)=> {
        this.state.chatList.push(msg);
        this.setState(this.state);
        // console.log(JSON.stringify(this.state.chatList));
        $('#messages').append($('<li>').text(msg.message));
      });
  }

  handleSubmit(e){
    e.preventDefault();
    var date = new Date;
    var sendVal = {
      user : this.state.user,
      message: this.state.message,
      time: date.getHours()+":"+date.getMinutes(),
    }
    this.send('message',sendVal);
    this.setState({message:''})
  }

  handleOnChange(e){
    this.setState({message:e.target.value});
  }

  handleUserName(e){
    this.setState({user:e.target.value});
  }

  send($params,$msg) {
    const socket = socketIOClient(url);
    socket.emit($params,$msg);
  }

  render() {
    let Message = this.state.chatList.map((item,i)=>{
      return (
        <MessageBar
          key={i}
          user={item.user}
          message={item.message}
          time={item.time}
          position={this.state.user===item.user?1:0}
          style={{}}
        />
      )
    });

    return this.state.logged===0?
    (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React Chat</h1>
        </header>

        <form onSubmit={this.handleLogin} className="inputName">
          <input type="text" onChange={this.handleUserName} value={this.state.user}/>
          <button>Send</button>
        </form>
      </div>
    )
    :
     (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome {this.state.user}</h1>
          <button className="logout" onClick={this.handleLogout}>Log Out</button>
        </header>

        <div className="message-list">
          {Message}
        </div>
        <div className="bottom" />
        <form className="form-message" onSubmit={this.handleSubmit}>
          <input className="message" type="text" onChange={this.handleOnChange} value={this.state.message}/>
          <button>Send</button>
        </form>
      </div>
    );
  }
}


export default App;
