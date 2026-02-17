# How to Add Your Game of Thrones Dragon Background Image

## Quick Instructions:

1. **Save Your Image:**
   - Save the Game of Thrones dragon image you showed me as `got-bg.jpg`
   - Place it in the `public` folder: `d:/dragon-dragon-ctf-main/dragon-dragon-ctf-main/public/got-bg.jpg`

2. **The image will automatically load!**
   - The code is already configured to use `/got-bg.jpg` first
   - Falls back to Unsplash images if not found

## What's Been Fixed:

✅ **Background Image:**
- Set to `background-attachment: fixed` (parallax effect)
- Multiple fallback images for reliability
- Properly positioned and scaled

✅ **Button Positioning:**
- **Back Button**: Now uses `sticky top-4` - stays at top when scrolling down
- **Logout Button**: Changed from `absolute` to `fixed` - always visible in top-right
- Both buttons have proper z-index (`z-50`) to stay on top

✅ **Scroll Behavior:**
- Background stays fixed while content scrolls (parallax effect)
- Buttons follow the scroll smoothly
- No layout shifts or jumping

## File Location:
Place your dragon image here:
```
public/got-bg.jpg
```

That's it! The page will automatically use your image with all the epic effects!
