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

/**
 * Convert course title to URL-friendly slug
 * @param title - Course title
 * @returns URL-friendly slug
 */
export const createCourseSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-|-$/g, '');
};

/**
 * Check if a string is a valid MongoDB ObjectId
 * @param str - String to check
 * @returns boolean
 */
export const isValidObjectId = (str: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(str);
};

/**
 * Create a slug from course title and ensure uniqueness with ID fallback
 * @param title - Course title
 * @param id - Course ID for uniqueness
 * @returns Unique slug
 */
export const createUniqueCourseSlug = (title: string, id: string): string => {
  const baseSlug = createCourseSlug(title);
  // If slug is empty or too short, use ID
  if (baseSlug.length < 3) {
    return id;
  }
  return baseSlug;
}; 