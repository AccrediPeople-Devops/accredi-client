# Test Components

This directory contains test pages for various components and features. These are development/testing utilities and are not part of the main application flow.

## Available Test Pages

### 🌍 `test-location-context.tsx`
**Purpose**: Tests the enhanced location context and country selection functionality
- **Route**: `/components/test/test-location-context`
- **Features Tested**:
  - Automatic geolocation detection
  - Manual country selection modal
  - Currency code display (same amount, different currency)
  - Persistent selection across page reloads
  - Real-time price updates

### 🎨 `test-rich-editor.tsx`
**Purpose**: Tests the enhanced rich text editor with improved features
- **Route**: `/components/test/test-rich-editor`
- **Features Tested**:
  - Smart clipboard handling (fixes black text on dark backgrounds)
  - Enhanced color palette with better organization
  - Font size controls with clear labels
  - Clear formatting functionality
  - Paste cleanup for document text

### 📂 `test-category-emoji.tsx`
**Purpose**: Tests course category creation with emoji support
- **Route**: `/components/test/test-category-emoji`
- **Features Tested**:
  - Enhanced image upload component
  - Emoji picker with 90+ professional emojis
  - Automatic emoji-to-PNG conversion
  - Server upload integration
  - Form submission and preview

## How to Access

These test pages can be accessed during development by navigating to their respective routes. They are useful for:

- **Development**: Testing new features in isolation
- **QA**: Verifying functionality works as expected
- **Documentation**: Demonstrating feature capabilities
- **Debugging**: Isolated environment for troubleshooting

## Note

These files are for development/testing purposes only and should not be included in production builds. Consider adding them to your build exclusions if needed. 