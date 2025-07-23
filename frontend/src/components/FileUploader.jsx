import { useState } from 'react';
// import ChatBox from './ChatBox';
import axios from 'axios';

const FileUploader = ({ onUploadSuccess, summarizeFinished }) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!selectedFiles) return alert("Please select a PDF file.");

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file); 
    });

    setUploading(true);

    try {

      const res = await axios.post(process.env.REACT_APP_API_BASE_URL + '/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // console.log(res.data.taskId);
      onUploadSuccess(res.data.taskId);
      setDocumentId(res.data.taskId);
      // alert("Upload successful!");
    } catch (err) {
      console.error(err);
      // alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="center" hidden={summarizeFinished}>
      <label htmlFor="fileUploader" className="file-uploader">
        {documentId ? (
          <span className="file-uploader-title">File uploaded successful,<br />Please wait for the Bot reply</span>
         ) :(
          <>
          <span className="file-uploader-title">Drop files here</span>
          or
          <input type="file" id="fileUploader" multiple  name="fileUploader" className="file-choose-button" accept=".pdf" onChange={handleFileChange} />

          <button className="file-choose-button file-upload-button" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
          </>
          )}
      </label>
    </div>
  );
};

export default FileUploader;
