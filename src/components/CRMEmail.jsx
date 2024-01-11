import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styles/BlogAdd.css";


function CRMeditor({ onDataTransfer, initialContent, type }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(initialContent);
  }, [initialContent]);

  const handleQuillChange = (value) => {
    setValue(value);
    onDataTransfer(value);
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
      // Add additional tools here
      ['color', 'background'],
      ['blockquote'],
      [{ script: 'sub' }, { script: 'super' }],
      ['blockquote', 'code-block'],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
    ],
  };

  return (
    type === "lead" ? (
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleQuillChange}
        modules={modules}
        className="quillEditor quillEditor2 crm-new-border"
      />
    )
   : (
    <ReactQuill
    theme="snow"
    value={value}
    onChange={handleQuillChange}
    modules={modules}
    className="quillEditor quillEditor3 crm-new-border"
  />
  )
  );
}

export default CRMeditor;
