"use client";

import React, { useState, useEffect } from "react";
import CustomContextMenu from "./CustomContextMenu";

interface ContextMenuProviderProps {
  children: React.ReactNode;
}

const ContextMenuProvider: React.FC<ContextMenuProviderProps> = ({ children }) => {
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      // Prevent default browser context menu
      event.preventDefault();
      
      // Don't show context menu on form elements, images, or links
      const target = event.target as HTMLElement;
      const isFormElement = target.tagName === 'INPUT' || 
                           target.tagName === 'TEXTAREA' || 
                           target.tagName === 'SELECT' ||
                           target.closest('input, textarea, select');
      
      const isImage = target.tagName === 'IMG';
      const isLink = target.tagName === 'A' || target.closest('a');
      const isButton = target.tagName === 'BUTTON' || target.closest('button');
      
      // Don't show on interactive elements
      if (isFormElement || isImage || isLink || isButton) {
        return;
      }

      setContextMenu({
        isOpen: true,
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handleClick = () => {
      setContextMenu(prev => ({ ...prev, isOpen: false }));
    };

    const handleScroll = () => {
      setContextMenu(prev => ({ ...prev, isOpen: false }));
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      {children}
      <CustomContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={closeContextMenu}
      />
    </>
  );
};

export default ContextMenuProvider;
