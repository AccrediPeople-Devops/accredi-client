import React from 'react';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  // Function to extract and convert text-align styles to Tailwind classes
  const convertTextAlign = (styleAttr: string): string => {
    const alignmentMap: Record<string, string> = {
      'left': 'text-left',
      'center': 'text-center', 
      'right': 'text-right',
      'justify': 'text-justify'
    };
    
    const alignMatch = styleAttr.match(/text-align:\s*(left|center|right|justify)/i);
    return alignMatch ? alignmentMap[alignMatch[1].toLowerCase()] || '' : '';
  };



  // Function to process HTML content with exact spacing preservation
  const processContent = (htmlContent: string): string => {
    if (!htmlContent) return '';
    
    let processedContent = htmlContent;
    
    // Convert HTML headings - minimal styling, no automatic spacing
    processedContent = processedContent
      .replace(/<h1([^>]*)>(.*?)<\/h1>/gi, (match, attrs, content) => {
        const alignClass = attrs.includes('style=') ? convertTextAlign(attrs) : '';
        return `<h1 class="text-2xl md:text-3xl font-black site-text-primary leading-tight ${alignClass}">${content}</h1>`;
      })
      .replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (match, attrs, content) => {
        const alignClass = attrs.includes('style=') ? convertTextAlign(attrs) : '';
        return `<h2 class="text-xl md:text-2xl font-bold site-text-primary leading-tight ${alignClass}">${content}</h2>`;
      })
      .replace(/<h3([^>]*)>(.*?)<\/h3>/gi, (match, attrs, content) => {
        const alignClass = attrs.includes('style=') ? convertTextAlign(attrs) : '';
        return `<h3 class="text-lg md:text-xl font-bold site-text-primary leading-tight ${alignClass}">${content}</h3>`;
      })
      .replace(/<h4([^>]*)>(.*?)<\/h4>/gi, (match, attrs, content) => {
        const alignClass = attrs.includes('style=') ? convertTextAlign(attrs) : '';
        return `<h4 class="text-base md:text-lg font-semibold site-text-primary leading-tight ${alignClass}">${content}</h4>`;
      });
    
    // Handle line breaks first - convert double breaks to spacing, single breaks to simple breaks
    processedContent = processedContent.replace(/(<br\s*\/?>\s*){2,}/gi, '<div class="mb-4"></div>');
    processedContent = processedContent.replace(/<br\s*\/?>/gi, '<br />');
    
    // Handle empty divs that represent spacing
    processedContent = processedContent.replace(/<div[^>]*>\s*<\/div>/gi, '<div class="mb-4"></div>');
    processedContent = processedContent.replace(/<div[^>]*><br[^>]*><\/div>/gi, '<div class="mb-4"></div>');
    
    // Convert paragraphs - NO automatic spacing unless there are multiple paragraphs
    const paragraphCount = (processedContent.match(/<p[^>]*>/gi) || []).length;
    
    processedContent = processedContent
      .replace(/<p([^>]*)>(.*?)<\/p>/gi, (match, attrs, content) => {
        if (!content.trim()) {
          // Empty paragraph - only create spacing if multiple paragraphs exist
          return paragraphCount > 1 ? '<div class="mb-4"></div>' : '';
        }
        const alignClass = attrs.includes('style=') ? convertTextAlign(attrs) : '';
        
        // Only add margin if there are multiple paragraphs
        const spacing = paragraphCount > 1 ? 'mb-4' : '';
        return `<p class="site-text-secondary ${spacing} leading-relaxed ${alignClass}">${content}</p>`;
      });
    
    // Style hyperlinks
    processedContent = processedContent
      .replace(/<a([^>]*)>(.*?)<\/a>/gi, (match, attrs, content) => {
        const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
        const href = hrefMatch ? hrefMatch[0] : '';
        const targetMatch = attrs.match(/target=["']([^"']*)["']/i);
        const target = targetMatch ? targetMatch[0] : 'target="_blank"';
        const relMatch = attrs.match(/rel=["']([^"']*)["']/i);
        const rel = relMatch ? relMatch[0] : 'rel="noopener noreferrer"';
        
        return `<a ${href} ${target} ${rel} class="text-[#4F46E5] hover:text-[#7C3AED] underline decoration-2 underline-offset-2 hover:decoration-[#7C3AED] transition-all duration-300 font-medium cursor-pointer">${content}</a>`;
      });
    
    // Convert divs - minimal spacing
    const divCount = (processedContent.match(/<div[^>]*>/gi) || []).length;
    
    processedContent = processedContent
      .replace(/<div([^>]*)>(.*?)<\/div>/gi, (match, attrs, content) => {
        if (!content.trim() || content === '<br />') {
          return '<div class="mb-4"></div>';
        }
        const alignClass = attrs.includes('style=') ? convertTextAlign(attrs) : '';
        // Only add spacing if there are multiple divs
        const spacing = divCount > 1 ? 'mb-4' : '';
        return `<div class="site-text-secondary ${spacing} leading-relaxed ${alignClass}">${content}</div>`;
      });
    
    // Handle plain text that's not wrapped
    if (!processedContent.includes('<p>') && !processedContent.includes('<h') && !processedContent.includes('<div>') && !processedContent.includes('<ul>') && !processedContent.includes('<ol>')) {
      processedContent = `<span class="site-text-secondary leading-relaxed">${processedContent}</span>`;
    }
    
    // Convert lists
    processedContent = processedContent
      .replace(/<ul[^>]*>/gi, '<ul class="space-y-2">')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '<li class="flex items-start gap-3"><div class="flex-shrink-0 w-5 h-5 mt-0.5"><svg class="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg></div><span class="site-text-secondary leading-relaxed">$1</span></li>');
    
    processedContent = processedContent
      .replace(/<ol[^>]*>/gi, '<ol class="space-y-2 list-decimal list-inside">')
      .replace(/<ol[^>]*><li[^>]*>(.*?)<\/li>/gi, '<ol class="space-y-2 list-decimal list-inside"><li class="site-text-secondary leading-relaxed ml-4">$1</li>');
    
    // Handle strong/bold text
    processedContent = processedContent
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '<strong class="font-bold site-text-primary">$1</strong>')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '<strong class="font-bold site-text-primary">$1</strong>');
    
    // Handle emphasis/italic text  
    processedContent = processedContent
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '<em class="italic site-text-secondary">$1</em>')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '<em class="italic site-text-secondary">$1</em>');
    
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