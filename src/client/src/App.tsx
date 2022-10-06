import React, {useEffect, useState} from 'react';
import './App.css';
import CustomTextArea from "./components/custom-text-area";
import MessageBox, {GetMessageItem} from "./components/message-box";
import MessageArea from "./components/message-area";
import axios from "axios";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";


function App() {
    const [messages, setMessages] = useState<GetMessageItem[]>([]);
    const [connection, setConnection] = useState<HubConnection>();
    
    useEffect(() => {
        axios.get<GetMessageItem[]>(process.env.REACT_APP_ORIGIN_API + '/history/20')
            .then(value => {
            setMessages(value.data);
        });
    }, []);
    
    const configureConnection = async () => {
        console.log('here')
        const connection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_ORIGIN_API + '/forum')
            .build();

        console.log(connection);

        try {
            await connection.start().then(async () => {
                connection.on('ReceiveMessage', (message: GetMessageItem) => {
                    console.log(message.text);
                    console.log(message.user.name);
                    
                    setMessages((st) => [...st, message]);
                });
            });

        } catch (err) {
            console.log(err);
        }
        return connection;
    }
    
    useEffect(() => {
        const cnct = async () => {
            setConnection(await configureConnection());
            console.log(connection)
        }

        cnct();
        console.log(connection);
    }, [])
    
    if (!connection)
        return <div>Loading...</div>
    
  return (
      <div className="App">
          <div className="chat-container">
              <h1 className={"forum-header"}>FORUM</h1>
              <MessageArea>
                  {messages.map(message =>
                      <MessageBox message={message}></MessageBox>
                  )}
              </MessageArea>
              <CustomTextArea connection={connection}/>
          </div>
      </div>
  );
}

export default App;
