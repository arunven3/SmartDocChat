import React, { useState, useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import ChatBox from '../components/ChatBox';


export const Homepage = () => {
  const [documentId, setDocumentId] = useState(null);
  const [isChatStarted, setIsChatStarted] = useState(false);

  return (
    <div className="homepage">
      <div>        
        {
        !isChatStarted &&  <>
          <h1>Welcome to {process.env.REACT_APP_AI_NAME}</h1>
          <h4>Upload your documents and start chatting with our {process.env.REACT_APP_AI_NAME} AI!</h4> 
          <FileUploader onUploadSuccess={setDocumentId}  /> 
        </>
        }
      </div>

      {documentId && <ChatBox documentId={documentId} isChatStarted={setIsChatStarted} />} 
    </div>
  );
}