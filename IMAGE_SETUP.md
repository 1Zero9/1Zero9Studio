# Image Setup Instructions

## Required Images

To complete the landing page and logo setup, please add these images to the `public/images/` folder:

### 1. Rocket Logo for Landing Page
- **File**: `redrocket-logo.jpg`
- **Location**: `public/images/redrocket-logo.jpg`
- **Purpose**: Animated landing page with pulsing effect
- **Recommended size**: 300x300px or larger (square format works best)

### 2. Main Logo for Navigation
- **File**: `109-black-bg-whitetext2.png`
- **Location**: `public/images/109-black-bg-whitetext2.png`
- **Purpose**: Main logo displayed after landing page, and small version in navigation
- **Recommended size**: 400x200px (2:1 aspect ratio works well)

## Current Setup

The website is configured to:

1. **Landing Page**: Shows black background with pulsing rocket logo for 3 seconds
2. **Main Site**: Transitions to white background with main logo centered
3. **Navigation**: Cool gradient navigation bar with logo in top-left when navigating
4. **Hover Effects**: Red accent color (#E72F2F) on navigation items with sliding underline

## File Structure

```
public/
├── images/
│   ├── redrocket-logo.jpg          (for landing page)
│   └── 109-black-bg-whitetext2.png (for main logo)
├── favicon.ico                     (if created)
└── apple-touch-icon.png           (if created)
```

## Features

- **Smooth animations**: Pulsing rocket, fade transitions
- **Session storage**: Landing page only shows once per session
- **Responsive design**: Works on all device sizes
- **Cool navigation**: Gradient background, hover effects, sliding underlines
- **Professional layout**: Clean white background with strategic use of your brand colors

## Next Steps

1. Add the two image files to `public/images/`
2. Restart your development server: `npm run dev`
3. Visit your website to see the animated landing page
4. Navigate through the site to see the logo placement and cool navigation effects

The landing page will show the pulsing rocket for 3 seconds, then smoothly transition to your main website with the professional logo and navigation system.
