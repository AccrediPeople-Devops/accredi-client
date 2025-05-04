"use client";

import React, { useState, useRef, useEffect } from "react";

interface RichTextEditorProps {
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minHeight?: string;
  id?: string;
}

export default function RichTextEditor({
  label,
  error,
  value,
  onChange,
  placeholder = "Start typing...",
  maxLength,
  minHeight = "180px",
  id,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  
  // Create a deterministic ID based solely on the label, with no randomness
  const editorId = id || `editor-${label ? label.replace(/\s+/g, '-').toLowerCase() : 'rich-text'}`;
  
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    link: false,
    orderedList: false,
    unorderedList: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    alignJustify: false,
  });
  
  // Initialize editor content and handle updates
  useEffect(() => {
    if (editorRef.current) {
      // Only update innerHTML if editor doesn't have focus to avoid cursor jumping
      if (!isFocused && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
      
      // Update character count
      updateCharCount();
    }
  }, [value, isFocused]);

  // Add event listener for selection changes to update active formats
  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        updateActiveFormats();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // Add styling for links and lists in the editor
  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on server
    
    const styleId = `style-${editorId}`;
    
    // Check if style already exists
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        #${editorId} a {
          color: #9C58D3;
          text-decoration: underline;
        }
        
        #${editorId} ul {
          list-style-type: disc;
          margin-left: 1.5em;
          padding-left: 0;
        }
        
        #${editorId} ol {
          list-style-type: decimal;
          margin-left: 1.5em;
          padding-left: 0;
        }
        
        #${editorId} li {
          margin-bottom: 0.5em;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        const styleElement = document.getElementById(styleId);
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
      };
    }
  }, [editorId]);

  const updateCharCount = () => {
    if (editorRef.current) {
      // Get plain text content without HTML tags
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorRef.current.innerHTML;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      // Update character count
      setCharCount(textContent.length);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      updateCharCount();
    }
  };

  // Special function to ensure proper list insertion
  const handleListCommand = (listType: 'insertOrderedList' | 'insertUnorderedList') => {
    if (!editorRef.current) return;
    
    // Focus the editor
    editorRef.current.focus();
    
    // Get current selection
    const selection = window.getSelection();
    if (!selection) return;
    
    // Execute the list command
    document.execCommand(listType, false);
    
    // Update state
    handleContentChange();
    updateActiveFormats();
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    // Special handling for list commands
    if (command === 'insertOrderedList' || command === 'insertUnorderedList') {
      handleListCommand(command);
      return;
    }
    
    // Make sure focus is in editor before executing command
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      handleContentChange();
      updateActiveFormats();
    }
  };

  const updateActiveFormats = () => {
    if (!editorRef.current) return;
    
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      link: document.queryCommandState("createLink"),
      orderedList: document.queryCommandState("insertOrderedList"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      alignLeft: document.queryCommandState("justifyLeft"),
      alignCenter: document.queryCommandState("justifyCenter"),
      alignRight: document.queryCommandState("justifyRight"),
      alignJustify: document.queryCommandState("justifyFull"),
    });
  };

  const handleLinkInsert = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const url = prompt("Enter URL:", "https://");
      if (url) {
        executeCommand("createLink", url);
      }
    } else {
      alert("Please select text to create a link");
    }
  };

  const formatButton = (
    format: keyof typeof activeFormats,
    command: string,
    icon: React.ReactNode,
    tooltip: string,
    value?: string
  ) => (
    <button
      type="button"
      className={`p-1.5 rounded-md transition-colors ${
        activeFormats[format]
          ? "bg-[#5B2C6F]/20 text-white"
          : "text-white/70 hover:bg-[#2D2D44] hover:text-white"
      }`}
      onClick={() => {
        if (command === "createLink") {
          handleLinkInsert();
        } else {
          executeCommand(command, value);
        }
      }}
      title={tooltip}
    >
      {icon}
    </button>
  );

  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-white">{label}</label>
      )}

      <div
        className={`rounded-lg border transition-all ${
          isFocused
            ? "border-[#5B2C6F] shadow-[0_0_0_2px_rgba(91,44,111,0.2)]"
            : "border-[#3A3A55]"
        } ${error ? "border-error" : ""}`}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#3A3A55] bg-[#2D2D44] rounded-t-lg">
          {/* Text formatting */}
          {formatButton(
            "bold",
            "bold",
            <span className="font-bold text-sm">B</span>,
            "Bold"
          )}
          
          {formatButton(
            "italic",
            "italic",
            <span className="italic text-sm">I</span>,
            "Italic"
          )}
          
          {formatButton(
            "underline",
            "underline",
            <span className="underline text-sm">U</span>,
            "Underline"
          )}
          
          <div className="w-px h-6 bg-[#3A3A55] mx-1"></div>
          
          {/* Text alignment */}
          {formatButton(
            "alignLeft",
            "justifyLeft",
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>,
            "Align Left"
          )}
          
          {formatButton(
            "alignCenter",
            "justifyCenter",
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M5.90625 12h12.1875M7.89062 17.25h8.21876" />
            </svg>,
            "Align Center"
          )}
          
          {formatButton(
            "alignRight",
            "justifyRight",
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M12 12h8.25m-8.25 5.25h8.25" />
            </svg>,
            "Align Right"
          )}
          
          <div className="w-px h-6 bg-[#3A3A55] mx-1"></div>
          
          {/* Link */}
          {formatButton(
            "link",
            "createLink",
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>,
            "Insert Link"
          )}
          
          <div className="w-px h-6 bg-[#3A3A55] mx-1"></div>
          
          {/* Lists */}
          {formatButton(
            "unorderedList",
            "insertUnorderedList",
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>,
            "Bulleted List"
          )}
          
          {formatButton(
            "orderedList",
            "insertOrderedList",
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="10" y1="6" x2="21" y2="6"></line>
              <line x1="10" y1="12" x2="21" y2="12"></line>
              <line x1="10" y1="18" x2="21" y2="18"></line>
              <path d="M4 6h1v4"></path>
              <path d="M4 10h2"></path>
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
            </svg>,
            "Numbered List"
          )}
        </div>

        {/* Editor */}
        <div
          id={editorId}
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning={true}
          className="p-3 bg-[#2A2A2A] text-white outline-none rounded-b-lg empty:before:content-[attr(data-placeholder)] empty:before:text-white/50 empty:before:pointer-events-none whitespace-pre-wrap"
          style={{ minHeight }}
          data-placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            handleContentChange();
          }}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          onInput={handleContentChange}
        />
      </div>

      {maxLength && (
        <div className="mt-1 text-xs text-white/50 text-right">
          {charCount}/{maxLength} characters
        </div>
      )}

      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
} 