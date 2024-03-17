
import { useEffect } from "react"
import socket from "./socket";
import { useState,useRef } from "react";
import { useParams } from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
export default function Chat(){
    const [privateRoom, setPrivateRoom] = useState(null);

    const [message,setMessage] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [mutual,setMutual] = useState([]);
    const [room, setRoom] = useState(null);
    const [messageReceived,setMessageReceived] = useState([]);
    const [messagesSent,setMessagesSent] = useState([]);
    const [showTranslated, setShowTranslated] = useState([]);
    const [allMessagesReceived, setAllMessagesReceived] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [other,setOther] = useState(null);
    
    const { id } = useParams();

    useEffect(() => {
        // Update id state when the component mounts
        setRoom(id);
    }, [room]);

    useEffect(() => {
        const chatPage = document.querySelector(".msg-page");
        if (chatPage) {
            setTimeout(() => {
                chatPage.scrollTop = chatPage.scrollHeight;
            }, 250); // Adjust the delay as needed
        }
    }, [allMessagesReceived, messagesSent]);

    const toggleTranslated = (index) => {
        const newShowTranslated = [...showTranslated];
        newShowTranslated[index] = !newShowTranslated[index];
        setShowTranslated(newShowTranslated);
        console.log("toggled");
    };
    

    useEffect(() => {

        const timer = setTimeout(() => {
            // Emit privateMessage event after 5 seconds
            socket.emit('privateMessage', id);
        }, 5000);
    
        // Clean up function to clear the timer when component unmounts or when the socket changes
        return () => clearTimeout(timer);
    }, [socket]);

    
    useEffect(() => {
        const joinPrivateRoom = ({generated,mutual,otherId}) => {
          
            // Emit a 'join-private-room' event with the private room ID

            socket.emit('join-private-room', {roomId:generated,id});
          
            // setRecipient(rec);
            console.log(generated,mutual,otherId)
            setMutual(mutual);
            setPrivateRoom(generated); // Update the state with the private room ID
            setOther(otherId);
            setIsLoading(false);
        };
    
        socket.on('privateRoom', joinPrivateRoom);
    
        return () => {
            socket.off('privateRoom', joinPrivateRoom);
        };
    }, []);
 
    const sendMessage = () => {

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const currentTime = `${hours}:${minutes} ${ampm}`;
        const messageWithTime = `${message}~${currentTime}`;
        const splitted = messageWithTime.split("~");
        const sentMessage = { content: splitted, time: now, type: "sent" };
    
        socket.emit("send_message",{message:messageWithTime,privateRoom,room})
       setMessagesSent([...messagesSent,sentMessage]);
     
    }


    useEffect(() => {
        console.log(allMessagesReceived);
        console.log("hooked");
    }, [allMessagesReceived]);

    useEffect(()=>{
       
        const receiveMessageHandler = (data) => {
            const [messageContent, translatedMessageContent, messageTime] = data.split("~");
        
            const receivedMessage = { content: [messageContent, translatedMessageContent,messageTime], time: new Date(), type: "received" };

            setMessageReceived(receivedMessage);
           
            setAllMessagesReceived(prevMessages => [...prevMessages, receivedMessage]);

           
        };
    
        // Add event listener
        socket.on("receive_message", receiveMessageHandler);
    
        // Cleanup function to remove event listener when component unmounts or when socket changes
        return () => {
            socket.off("receive_message", receiveMessageHandler);
        };
    },[socket])

    const sortedMessages = [...allMessagesReceived, ...messagesSent].sort((a, b) => a.time - b.time);

    return (
        <>

        

		<div class="logoNavbar">
     
  <div class="logo">
	<img src={require("../Images/logo-no-background.png")} />
  </div>
</div>


<ul class="interestsul">
    {mutual.length !== 0 && (
        <h4><span style={{fontSize:'1.2rem',left:"10%",position:"relative"}} class="interestsspan">Things you like in common :)</span></h4>
    )}    
            {mutual.length !== 0 && mutual.map((m)=>{
              
                return (
                    
                    <li><span class="interestsspan">{m}</span></li>
                )
            })}
	   
        
        </ul>

        {isLoading ? (
            <>
                <div className="loader"></div>
                
                </>
            ) : (
<div class="chatcontainer">
   
      <div class="msg-header">
        {other && (
             <div class="container1"><div class="active">
            <p class="userP">{other}</p>
          </div>
        </div>
        )}
       
        
          
      </div>
     
      <div class="chat-page">
        <div  class="msg-inbox">
          <div class="chats">
           
            <div    class="msg-page">
             
             
            <AnimatePresence>
            {sortedMessages.map((message, index) => (
                    <motion.div initial={{opacity:0,height:0}} transition={{opacity:0.15}} animate={{opacity:1,height:"auto"}} key={index} className={message.type === "sent" ? "outgoing-chats" : "received-chats"}>
                        <div className={message.type === "sent" ? "outgoing-msg" : "received-msg"}>
                            {message.type === "sent" ? (
                                <div className="outgoing-chats-msg">
                                    <p className="multi-msg">{message.content[0]}</p>
                                    <span className="time">{message.content[1]}</span>
                                </div>
                            ) : (
                                <div className="received-msg-inbox">
                                    <div onClick={() => toggleTranslated(index)} className="circle1">
                                        <img src={require("../Images/translate.png")} alt="Translate" />
                                    </div>
                                    <p>{showTranslated[index] ? message.content[0] : message.content[1]}</p>
                                    <span className="time">{message.content[2]}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>

            {/* {allMessagesReceived.map((messageArray, index) => (
                <div key={index}>
                    <div class="received-chats">
                        <div class="received-msg">
                            <div onClick={() => toggleTranslated(index)} className="circle1">
                                <img src={require("../Images/translate.png")} alt="Translate" />
                            </div>
                            <div class="received-msg-inbox">
                                <p>
                                    {showTranslated[index] ? messageArray[0] : messageArray[1]}
                                </p>
                                <span class="time">{messageArray[2]}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
              
             
              {messagesSent.map((messageArray, index) => (
                <div key={index}>
                    <div class="outgoing-chats">
              
                <div class="outgoing-msg">
                  <div class="outgoing-chats-msg">
                    <p class="multi-msg">
                      {messageArray[0]}
                    </p>
                   

                    <span class="time">{messageArray[1]}</span>
                  </div>
                </div>
              </div>
                </div>
            ))} */}
             
            </div >
          </div>

         
          <div class="msg-bottom">
            <div class="input-group">
              <input
                type="text"
                id="messageInput"
                class="form-control"
                placeholder="Send message..."

                onChange={(e)=> setMessage(e.target.value)}
              />

              <span id="sendSpan" onClick={sendMessage} class="input-group-text send-icon">
              <svg style={{height:"auto"}} fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.009,10.845a1,1,0,0,0,.849.859l8.258,1.18,1.18,8.258a1,1,0,0,0,1.909.252l7.714-18a1,1,0,0,0-1.313-1.313L2.606,9.8A1,1,0,0,0,2.009,10.845Zm11.762,6.483-.711-4.974,4.976-4.976Zm2.85-11.363-4.974,4.974-4.976-.71Z"/></svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    )}
        </>
    )
}