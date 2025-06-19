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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const fontSizePickerRef = useRef<HTMLDivElement>(null);
  
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
    heading1: false,
    heading2: false,
    heading3: false,
  });

  // Color palette for text colors - organized by category
  const colorPalette = [
    // Essential colors
    { color: '#FFFFFF', name: 'White' },
    { color: '#000000', name: 'Black' },
    { color: '#6C757D', name: 'Gray' },
    
    // Primary colors
    { color: '#DC3545', name: 'Red' },
    { color: '#FFC107', name: 'Yellow' },
    { color: '#007BFF', name: 'Blue' },
    
    // Secondary colors
    { color: '#28A745', name: 'Green' },
    { color: '#FD7E14', name: 'Orange' },
    { color: '#6F42C1', name: 'Purple' },
    
    // Additional colors
    { color: '#17A2B8', name: 'Cyan' },
    { color: '#E83E8C', name: 'Pink' },
    { color: '#20C997', name: 'Teal' },
  ];

  // Font sizes
  const fontSizes = [
    { label: 'Small', value: '12px' },
    { label: 'Normal', value: '14px' },
    { label: 'Medium', value: '16px' },
    { label: 'Large', value: '18px' },
    { label: 'X-Large', value: '20px' },
    { label: 'XX-Large', value: '24px' },
    { label: 'Huge', value: '32px' },
  ];
  
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
      if (fontSizePickerRef.current && !fontSizePickerRef.current.contains(event.target as Node)) {
        setShowFontSizePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add styling for links, lists, and headings in the editor
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
        
        #${editorId} h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          line-height: 1.2;
        }
        
        #${editorId} h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
          line-height: 1.3;
        }
        
        #${editorId} h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.83em 0;
          line-height: 1.4;
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

  // Handle paste event to clean up formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    // Get the pasted data
    const paste = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
    
    if (paste) {
      // Create a temporary div to clean the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = paste;
      
      // Remove all style attributes and problematic formatting
      const cleanHtml = cleanPastedContent(tempDiv);
      
      // Insert the cleaned content
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, cleanHtml);
        handleContentChange();
      }
    }
  };

  // Clean pasted content to remove problematic formatting
  const cleanPastedContent = (element: HTMLElement): string => {
    // Remove all style attributes
    const elementsWithStyle = element.querySelectorAll('[style]');
    elementsWithStyle.forEach(el => {
      el.removeAttribute('style');
    });

    // Remove font tags that might have color attributes
    const fontTags = element.querySelectorAll('font');
    fontTags.forEach(font => {
      const span = document.createElement('span');
      span.innerHTML = font.innerHTML;
      font.parentNode?.replaceChild(span, font);
    });

    // Remove any elements with problematic color styling
    const colorElements = element.querySelectorAll('[color]');
    colorElements.forEach(el => {
      el.removeAttribute('color');
    });

    // Apply default text color to ensure visibility
    const allTextElements = element.querySelectorAll('*');
    allTextElements.forEach(el => {
      if (el.textContent && el.textContent.trim() !== '') {
        (el as HTMLElement).style.color = 'inherit';
      }
    });

    return element.innerHTML;
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
    
    // Check for heading tags
    const selection = window.getSelection();
    let heading1 = false, heading2 = false, heading3 = false;
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let node: Node | null = range.commonAncestorContainer;
      
      // Walk up the DOM tree to find heading tags
      while (node && node !== editorRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = (node as Element).tagName;
          if (tagName === 'H1') heading1 = true;
          if (tagName === 'H2') heading2 = true;
          if (tagName === 'H3') heading3 = true;
        }
        node = node.parentNode;
      }
    }
    
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
      heading1,
      heading2,
      heading3,
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

  const handleColorChange = (color: string) => {
    executeCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const handleFontSizeChange = (size: string) => {
    executeCommand("fontSize", "3"); // Reset to default size first
    
    // Apply inline style for better control
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = size;
        span.appendChild(range.extractContents());
        range.insertNode(span);
        selection.removeAllRanges();
      }
      handleContentChange();
    }
    setShowFontSizePicker(false);
  };

  const clearFormatting = () => {
    executeCommand("removeFormat");
    // Also clear any inline styles
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const contents = range.extractContents();
        const textContent = contents.textContent || '';
        range.insertNode(document.createTextNode(textContent));
      }
      handleContentChange();
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

  const headingButton = (
    level: 1 | 2 | 3,
    isActive: boolean,
    tooltip: string
  ) => (
    <button
      type="button"
      className={`px-2 py-1.5 rounded-md transition-colors font-medium text-sm ${
        isActive
          ? "bg-[#5B2C6F]/20 text-white"
          : "text-white/70 hover:bg-[#2D2D44] hover:text-white"
      }`}
      onClick={() => {
        executeCommand("formatBlock", `<h${level}>`);
      }}
      title={tooltip}
    >
      H{level}
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
          
          {/* Color Picker */}
          <div className="relative" ref={colorPickerRef}>
            <button
              type="button"
              className="p-1.5 rounded-md transition-colors text-white/70 hover:bg-[#2D2D44] hover:text-white"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Text Color"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M4.098 19.902A3.75 3.75 0 109.402 4.098m0 15.804l6.401-6.402M9.402 4.098a3.75 3.75 0 010 5.304l-6.401 6.402M9.402 4.098l6.401 6.402" />
              </svg>
            </button>
            
            {showColorPicker && (
              <div className="absolute top-full left-0 z-10 mt-1 p-3 bg-[#2D2D44] border border-[#3A3A55] rounded-lg shadow-lg min-w-[200px]">
                <div className="text-xs text-white/70 mb-3 font-medium">Essential Colors</div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {colorPalette.slice(0, 3).map((colorItem) => (
                    <button
                      key={colorItem.color}
                      type="button"
                      className="w-10 h-10 rounded-md border-2 border-[#3A3A55] hover:border-[#5B2C6F] hover:scale-105 transition-all duration-200 flex items-center justify-center group"
                      style={{ backgroundColor: colorItem.color }}
                      onClick={() => handleColorChange(colorItem.color)}
                      title={colorItem.name}
                    >
                      {colorItem.color === '#FFFFFF' && (
                        <div className="w-full h-full rounded-md border border-gray-200"></div>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="text-xs text-white/70 mb-3 font-medium">Primary Colors</div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {colorPalette.slice(3, 6).map((colorItem) => (
                    <button
                      key={colorItem.color}
                      type="button"
                      className="w-10 h-10 rounded-md border-2 border-[#3A3A55] hover:border-[#5B2C6F] hover:scale-105 transition-all duration-200"
                      style={{ backgroundColor: colorItem.color }}
                      onClick={() => handleColorChange(colorItem.color)}
                      title={colorItem.name}
                    />
                  ))}
                </div>
                
                <div className="text-xs text-white/70 mb-3 font-medium">More Colors</div>
                <div className="grid grid-cols-3 gap-2">
                  {colorPalette.slice(6).map((colorItem) => (
                    <button
                      key={colorItem.color}
                      type="button"
                      className="w-10 h-10 rounded-md border-2 border-[#3A3A55] hover:border-[#5B2C6F] hover:scale-105 transition-all duration-200"
                      style={{ backgroundColor: colorItem.color }}
                      onClick={() => handleColorChange(colorItem.color)}
                      title={colorItem.name}
                    />
                  ))}
                </div>
                
                <div className="text-xs text-white/50 text-center mt-3 pt-2 border-t border-[#3A3A55]">
                  Select text first, then click a color
                </div>
              </div>
            )}
          </div>

          {/* Font Size Picker */}
          <div className="relative" ref={fontSizePickerRef}>
            <button
              type="button"
              className="px-2 py-1.5 rounded-md transition-colors text-white/70 hover:bg-[#2D2D44] hover:text-white text-sm font-medium"
              onClick={() => setShowFontSizePicker(!showFontSizePicker)}
              title="Font Size"
            >
              A
            </button>
            
            {showFontSizePicker && (
              <div className="absolute top-full left-0 z-10 mt-1 bg-[#2D2D44] border border-[#3A3A55] rounded-lg shadow-lg min-w-[140px]">
                <div className="p-2 border-b border-[#3A3A55]">
                  <div className="text-xs text-white/70 font-medium">Font Size</div>
                </div>
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    className="w-full text-left px-3 py-2.5 text-sm text-white/70 hover:bg-[#3A3A55] hover:text-white transition-colors border-b border-[#3A3A55]/30 last:border-b-0 flex items-center justify-between"
                    onClick={() => handleFontSizeChange(size.value)}
                  >
                    <span>{size.label}</span>
                    <span className="text-xs text-white/40">{size.value}</span>
                  </button>
                ))}
                <div className="p-2 border-t border-[#3A3A55]">
                  <div className="text-xs text-white/50 text-center">Select text first</div>
                </div>
              </div>
            )}
          </div>

          {/* Clear Formatting */}
          <button
            type="button"
            className="p-1.5 rounded-md transition-colors text-white/70 hover:bg-[#2D2D44] hover:text-white"
            onClick={clearFormatting}
            title="Clear Formatting"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="w-px h-6 bg-[#3A3A55] mx-1"></div>
          
          {/* Headings */}
          {headingButton(1, activeFormats.heading1, "Heading 1")}
          {headingButton(2, activeFormats.heading2, "Heading 2")}
          {headingButton(3, activeFormats.heading3, "Heading 3")}
          
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
          onPaste={handlePaste}
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