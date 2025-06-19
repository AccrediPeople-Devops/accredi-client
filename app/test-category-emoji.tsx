"use client";

import React, { useState } from "react";
import CourseCategoryForm from "./components/course-categories/CourseCategoryForm";

export default function TestCategoryEmoji() {
  const [submittedData, setSubmittedData] = useState<any>(null);

  const handleSubmit = (data: any) => {
    console.log("Submitted category data:", data);
    setSubmittedData(data);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Course Category with Emoji Support Test</h1>
      
      <div className="bg-[var(--background)] p-6 rounded-lg border border-[var(--border)] mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">✨ New Features Added:</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#3A3A55]">
            <h3 className="text-white font-semibold mb-2">🎨 Enhanced Image Upload</h3>
            <ul className="text-white/70 space-y-1 text-sm">
              <li>• <strong>Emoji picker</strong> with 90+ professional emojis</li>
              <li>• <strong>Automatic conversion</strong> to high-quality PNG images</li>
              <li>• <strong>Transparent backgrounds</strong> for perfect integration</li>
              <li>• <strong>Server upload</strong> just like regular images</li>
              <li>• <strong>Same file management</strong> as existing images</li>
            </ul>
          </div>
          
          <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#3A3A55]">
            <h3 className="text-white font-semibold mb-2">⚡ How It Works</h3>
            <ul className="text-white/70 space-y-1 text-sm">
              <li>• <strong>Choose "Use Emoji"</strong> instead of uploading</li>
              <li>• <strong>Select from curated collection</strong> of relevant emojis</li>
              <li>• <strong>Emoji renders to 256x256 PNG</strong> automatically</li>
              <li>• <strong>Uploads to same endpoint</strong> as images</li>
              <li>• <strong>Returns URL</strong> for display throughout app</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-[#2A2A2A] p-4 rounded-lg border border-[#3A3A55]">
          <h3 className="text-white font-semibold mb-2">🎯 Benefits</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-white/90 font-medium mb-1">Consistent Design</h4>
              <p className="text-white/70 text-sm">All emojis converted to same size and format</p>
            </div>
            <div>
              <h4 className="text-white/90 font-medium mb-1">Fast Creation</h4>
              <p className="text-white/70 text-sm">No need to search for or create custom icons</p>
            </div>
            <div>
              <h4 className="text-white/90 font-medium mb-1">Perfect Quality</h4>
              <p className="text-white/70 text-sm">High-resolution with transparent backgrounds</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--background)] p-6 rounded-lg border border-[var(--border)]">
        <h2 className="text-lg font-semibold text-white mb-4">Test the Enhanced Form</h2>
        
        <CourseCategoryForm
          onSubmit={handleSubmit}
          initialCategory={{
            name: "",
            description: "",
            image: [],
            isActive: true,
          }}
          submitButtonText="Test Create Category"
        />
      </div>

      {submittedData && (
        <div className="mt-8 bg-[var(--background)] p-6 rounded-lg border border-[var(--border)]">
          <h2 className="text-lg font-semibold text-white mb-4">📋 Submitted Data</h2>
          <div className="bg-[#2A2A2A] p-4 rounded-lg">
            <pre className="text-white/70 text-sm whitespace-pre-wrap overflow-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
          
          {submittedData.image && submittedData.image.length > 0 && (
            <div className="mt-4">
              <h3 className="text-white font-medium mb-2">Category Image Preview:</h3>
              <div className="bg-white p-4 rounded-lg inline-block">
                <img 
                  src={submittedData.image[0].path ? 
                    `http://api.accredipeoplecertifications.com${submittedData.image[0].path}` : 
                    'placeholder'
                  }
                  alt="Category"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-lg border border-blue-500/20">
        <h2 className="text-lg font-semibold text-white mb-3">🚀 Implementation Complete!</h2>
        <p className="text-white/80">
          Course categories now support both traditional image uploads and emoji selection. 
          The emoji picker includes 90+ carefully curated emojis organized by category, 
          all automatically converted to high-quality transparent PNG images and uploaded 
          to your server just like regular images.
        </p>
        
        <div className="mt-4 text-sm text-white/60">
          <strong>Next Steps:</strong> The same EnhancedImageUpload component can be used 
          anywhere in your app where you want emoji support alongside image uploads.
        </div>
      </div>
    </div>
  );
} 