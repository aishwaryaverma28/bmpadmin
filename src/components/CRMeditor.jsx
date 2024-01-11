import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./styles/BlogAdd.css";

function CRMeditor({ onDataTransfer, initialContent }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(initialContent);
  }, [initialContent]);

  const handleQuillChange = (value) => {
    setValue(value);
    onDataTransfer(value); 
  };
  const modules = {
        toolbar: [
          ['bold', 'italic', 'underline'],
        ],
      };
    
  return <ReactQuill theme="snow" value={value} onChange={handleQuillChange} modules={modules} className="quillEditor"/>;
}

export default CRMeditor;
