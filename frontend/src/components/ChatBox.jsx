import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize'


const ChatBox = ({ documentId, isChatStarted }) => {
  const name = process.env.REACT_APP_AI_NAME;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);
  const socket = useSocket(documentId);

  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('answer_chunk', (chunk) => {
      isChatStarted(true);
      
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.sender === name) {
          return [...prev.slice(0, -1), { ...last, text: last.text + chunk }];
        } else {
          return [...prev, { sender: name, text: chunk }];
        }
      });
    });

    socket.on('answer_done', () => {
      console.log('Done receiving');
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('askQuestion', {
        docId: documentId,
        question: 'Summarize the document.'
      });
    });

    return () => {
      socket.off('answer_chunk');
      socket.off('answer_done');
    };
  }, [socket]);

  const handleSend = () => {
    setMessages((prev) => [...prev, { sender: 'user', text: input.trim() }]);

    console.log('Emitting:', {
      docId: documentId,
      question: input.trim(),
    });

    socket.emit('askQuestion',  {
      docId: documentId,
      question: input.trim()
    });

    setInput('');
  };

  return (
    <div  className= "chat-module">
      <div ref={messagesContainerRef} className='chat-box-messages'>
          {messages.map((msg, idx) => (
            <div key={idx} className={ (msg.sender === 'user' ? 'send' : 'recieve') + ' message' } style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
              <b>{msg.sender === 'user' ? "You" : "Bot"}:</b> <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{msg.text}</ReactMarkdown>
            </div>
          ))}
      </div>
      <div class="form-group">
        <input class="form-field" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..."/>
        <span className='send-btn' onClick={handleSend}>send</span>
      </div>

    </div>
  );
};

export default ChatBox;
