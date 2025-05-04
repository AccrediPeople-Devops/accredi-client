/**
 * Strips HTML tags from a string
 */
export const stripHtml = (html: string): string => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

/**
 * Strips HTML and truncates text to specified length with ellipsis
 */
export const truncateHtml = (html: string, maxLength: number): string => {
  const plainText = stripHtml(html);
  if (plainText.length <= maxLength) return plainText;
  
  return plainText.substring(0, maxLength) + "...";
};

/**
 * Creates a preview of HTML content by stripping tags and truncating
 */
export const createHtmlPreview = (html: string, maxLength: number = 100): string => {
  return truncateHtml(html, maxLength);
}; 