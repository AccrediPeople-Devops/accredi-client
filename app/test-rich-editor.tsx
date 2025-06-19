"use client";

import React, { useState } from "react";
import RichTextEditor from "./components/RichTextEditor";

export default function TestRichEditor() {
  const [content, setContent] = useState("");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Enhanced Rich Text Editor Test</h1>
      
      <div className="bg-[var(--background)] p-6 rounded-lg">
        <RichTextEditor
          label="Test the Enhanced Editor"
          value={content}
          onChange={setContent}
          placeholder="Try pasting text from a document, use the color picker, or change font sizes..."
          minHeight="300px"
        />
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">✨ Enhanced Features:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#3A3A55]">
              <h4 className="text-white font-semibold mb-2">🎨 Improved Color Palette</h4>
              <ul className="text-white/70 space-y-1 text-sm">
                <li>• <strong>Organized by category:</strong> Essential, Primary, More Colors</li>
                <li>• <strong>Larger color swatches</strong> (40x40px vs 24x24px)</li>
                <li>• <strong>Better spacing</strong> and hover effects</li>
                <li>• <strong>12 carefully selected colors</strong> instead of 18</li>
                <li>• <strong>Clear labels</strong> and tooltips</li>
              </ul>
            </div>
            
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#3A3A55]">
              <h4 className="text-white font-semibold mb-2">📐 Enhanced Font Size Control</h4>
              <ul className="text-white/70 space-y-1 text-sm">
                <li>• <strong>Clear size labels</strong> with pixel values</li>
                <li>• <strong>Better visual hierarchy</strong> with headers</li>
                <li>• <strong>7 font sizes:</strong> Small (12px) to Huge (32px)</li>
                <li>• <strong>Improved spacing</strong> and readability</li>
                <li>• <strong>Usage instructions</strong> included</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 bg-[#2A2A2A] p-4 rounded-lg border border-[#3A3A55]">
            <h4 className="text-white font-semibold mb-2">🔧 Smart Paste & Clear Formatting</h4>
            <ul className="text-white/70 space-y-1 text-sm">
              <li>• <strong>Automatic cleanup</strong> of pasted content from documents</li>
              <li>• <strong>Removes invisible black text</strong> that appears on dark backgrounds</li>
              <li>• <strong>Clear formatting button</strong> (X) to remove all styling</li>
              <li>• <strong>Preserves basic formatting</strong> while fixing color issues</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">How to Test the Clipboard Fix:</h3>
          <ol className="text-white/70 space-y-2 list-decimal list-inside">
            <li>Open a Word document or Google Doc with black text</li>
            <li>Copy some text (Ctrl+C or Cmd+C)</li>
            <li>Paste it into the editor above (Ctrl+V or Cmd+V)</li>
            <li>The text should appear visible (not black on dark background)</li>
            <li>Use the color picker to change the text color as needed</li>
          </ol>
        </div>

        {content && (
          <div className="mt-6 p-4 bg-[#2A2A2A] rounded-lg border border-[#3A3A55]">
            <h3 className="text-lg font-semibold text-white mb-3">Current Content (HTML):</h3>
            <pre className="text-xs text-white/70 whitespace-pre-wrap break-all">
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 