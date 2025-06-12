import React from 'react';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  // Simple function to process HTML content
  const processContent = (htmlContent: string): string => {
    if (!htmlContent) return '';
    
    let processedContent = htmlContent;
    
    // Convert HTML headings to properly styled versions
    processedContent = processedContent
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '<h1 class="text-2xl md:text-3xl font-black site-text-primary mb-4 mt-4">$1</h1>')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '<h2 class="text-xl md:text-2xl font-bold site-text-primary mb-3 mt-4">$1</h2>')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '<h3 class="text-lg md:text-xl font-bold site-text-primary mb-3 mt-4">$1</h3>')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '<h4 class="text-base md:text-lg font-semibold site-text-primary mb-2 mt-3">$1</h4>');
    
    // Convert paragraphs - ensure theme colors are applied
    processedContent = processedContent
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '<p class="site-text-secondary mb-3 leading-relaxed">$1</p>');
    
    // Handle text that's not wrapped in tags (this might be causing the black text)
    if (!processedContent.includes('<p>') && !processedContent.includes('<h') && !processedContent.includes('<div>')) {
      // If it's just plain text, wrap it properly
      processedContent = `<p class="site-text-secondary leading-relaxed">${processedContent}</p>`;
    }
    
    // Fix any remaining text nodes that don't have proper styling
    processedContent = processedContent.replace(/^([^<]+)/, '<span class="site-text-secondary">$1</span>');
    
    // Convert unordered lists to green checkmarks
    processedContent = processedContent
      .replace(/<ul[^>]*>/gi, '<ul class="space-y-2 mb-4">')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '<li class="flex items-start gap-3"><div class="flex-shrink-0 w-5 h-5 mt-0.5"><svg class="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg></div><span class="site-text-secondary leading-relaxed">$1</span></li>');
    
    // Convert divs and line breaks
    processedContent = processedContent
      .replace(/<div[^>]*><\/div>/gi, '')
      .replace(/<div[^>]*>(.*?)<\/div>/gi, '<div class="site-text-secondary mb-2">$1</div>')
      .replace(/<br\s*\/?>/gi, '<br />');
    
    return processedContent;
  };

  // If no content, return empty div
  if (!content) {
    return <div className={className}></div>;
  }

  const processedContent = processContent(content);

  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default RichTextRenderer; 