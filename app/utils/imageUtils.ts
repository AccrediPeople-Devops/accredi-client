/**
 * Generates a placeholder image URL for the application
 * @param backgroundColor HEX color code without # (e.g., "7E57C2")
 * @param textColor HEX color code without # (e.g., "FFFFFF")
 * @param text Text to display on the placeholder
 * @param width Width in pixels
 * @param height Height in pixels
 * @returns URL string for the placeholder image
 */
export function generatePlaceholderImage(
  backgroundColor: string = "7E57C2",
  textColor: string = "FFFFFF",
  text: string = "",
  width: number = 600,
  height: number = 400
): string {
  const formattedText = text.replace(/ /g, "+");
  return `https://placehold.co/${width}x${height}/${backgroundColor}/${textColor}?text=${formattedText}`;
}

/**
 * Creates a placeholder image URL for a course category
 * @param name Name of the category (will be used as text)
 * @param colorIndex Optional index to select from preset colors
 * @returns URL string for the category placeholder image
 */
export function getCategoryPlaceholderImage(
  name: string,
  colorIndex: number = 0
): string {
  // Purple theme color palette
  const colors = ["7E57C2", "9575CD", "B39DDB", "5E35B1", "673AB7"];
  const selectedColor = colors[colorIndex % colors.length];

  return generatePlaceholderImage(selectedColor, "FFFFFF", name);
}
