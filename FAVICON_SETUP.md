# Favicon Setup Instructions

## Adding the Rocket Favicon

To set up the favicon using your rocket_trans_250x250.png image, follow these steps:

### Step 1: Prepare the Rocket Image
1. Locate your `rocket_trans_250x250.png` file
2. Copy it to the `public` folder in your project root

### Step 2: Convert to Multiple Favicon Formats
You'll need to create multiple sizes and formats for optimal browser support:

**Required favicon files to create:**
- `favicon.ico` (16x16, 32x32, 48x48 pixels) - Place in `/public/favicon.ico`
- `apple-touch-icon.png` (180x180 pixels) - Place in `/public/apple-touch-icon.png`
- `favicon-16x16.png` (16x16 pixels) - Place in `/public/favicon-16x16.png`
- `favicon-32x32.png` (32x32 pixels) - Place in `/public/favicon-32x32.png`

### Step 3: Convert Using Online Tools
You can use these free online tools to convert your rocket image:

1. **Favicon.io** (https://favicon.io/favicon-converter/)
   - Upload your rocket_trans_250x250.png
   - Download the generated favicon package
   - Extract and place files in the `/public` folder

2. **RealFaviconGenerator** (https://realfavicongenerator.net/)
   - Upload your rocket image
   - Customize settings if needed
   - Generate and download the package
   - Place files in the `/public` folder

### Step 4: File Structure
After conversion, your `/public` folder should contain:
```
public/
├── favicon.ico
├── apple-touch-icon.png
├── favicon-16x16.png
├── favicon-32x32.png
└── rocket_trans_250x250.png (original)
```

### Step 5: Verify
1. Restart your development server: `npm run dev`
2. Visit your website
3. Check the browser tab for the rocket favicon
4. Test on mobile devices to see the apple-touch-icon

## Advanced Configuration (Optional)

If you need more favicon formats, you can update the metadata in `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "1Zero9 Studio",
  description: "Professional web development and management services.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};
```

## Notes
- The favicon configuration is already set up in your layout.tsx
- Transparent backgrounds work well for favicons
- The rocket theme fits perfectly with your tech/development business
- Make sure the rocket is clearly visible at small sizes (16x16 pixels)
