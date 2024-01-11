import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles/BlogAdd.css';

function ReactEditor({ onDataTransfer, initialContent }, ref) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(initialContent);
  }, [initialContent]);

  const handleQuillChange = (newValue) => {
    setValue(newValue);
    onDataTransfer(newValue);
  };

  // Method to clear the editor content
  const clearEditorContent = () => {
    setValue('');
    onDataTransfer(''); // Notify the parent that content is cleared
  };

  useImperativeHandle(ref, () => ({
    clearEditorContent
  }));

  const modules = {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
          ['blockquote'],
          [{ script: 'sub' }, { script: 'super' }],
          ['blockquote', 'code-block'],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          ['video'],
        ],
      };
    
  return <ReactQuill theme="snow" value={value} onChange={handleQuillChange} modules={modules} className="quillEditor"/>;
}

export default forwardRef(ReactEditor); // Add forwardRef here
