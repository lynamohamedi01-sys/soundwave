from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math

SIZE = 1024

def create_gradient_bg(size):
    """Create a smooth radial gradient background"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    cx, cy = size // 2, size // 2
    
    for y in range(size):
        for x in range(size):
            dx = x - cx
            dy = y - cy
            dist = math.sqrt(dx*dx + dy*dy) / (size / 2)
            dist = min(dist, 1.0)
            
            # Deep purple center -> dark navy edge
            r = int(80 - dist * 70)
            g = int(20 - dist * 15)
            b = int(160 - dist * 100)
            
            # Add subtle radial glow
            glow = max(0, 1 - dist * 1.2)
            r = min(255, int(r + glow * 180))
            g = min(255, int(g + glow * 60))
            b = min(255, int(b + glow * 80))
            
            img.putpixel((x, y), (max(0, r), max(0, g), max(0, b), 255))
    
    return img

def draw_rounded_rect(draw, bbox, radius, fill):
    """Draw a rounded rectangle"""
    x1, y1, x2, y2 = bbox
    draw.rounded_rectangle(bbox, radius=radius, fill=fill)

def draw_music_bars(img, cx, cy, bar_w=90, gap=50):
    """Draw 5 music equalizer bars with rounded tops"""
    draw = ImageDraw.Draw(img)
    
    heights = [180, 320, 420, 280, 160]
    colors = [
        (0, 212, 255),    # Cyan
        (80, 130, 255),   # Blue  
        (168, 85, 247),   # Purple
        (255, 107, 107),  # Coral
        (255, 159, 67),   # Orange
    ]
    
    total_w = len(heights) * bar_w + (len(heights) - 1) * gap
    start_x = cx - total_w // 2
    
    for i, (h, color) in enumerate(zip(heights, colors)):
        x1 = start_x + i * (bar_w + gap)
        y1 = cy - h // 2
        x2 = x1 + bar_w
        y2 = cy + h // 2
        
        # Draw bar with rounded corners
        draw_rounded_rect(draw, [x1, y1, x2, y2], bar_w // 2, color)
        
        # Add white highlight on top
        highlight_color = tuple(min(255, c + 80) for c in color)
        draw_rounded_rect(draw, [x1 + 10, y1, x2 - 10, y1 + h // 4], bar_w // 4, highlight_color)

def add_glow(img, cx, cy, radius=250, intensity=60):
    """Add a soft glow effect"""
    glow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    
    for r in range(radius, 0, -2):
        alpha = int(intensity * (1 - r / radius) ** 2)
        draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=(168, 85, 247, alpha)
        )
    
    glow = glow.filter(ImageFilter.GaussianBlur(radius=20))
    return Image.alpha_composite(img, glow)

def create_icon():
    # Background gradient
    img = create_gradient_bg(SIZE)
    
    cx, cy = SIZE // 2, SIZE // 2
    
    # Add glow
    img = add_glow(img, cx, cy, radius=280, intensity=80)
    
    # Draw music bars
    draw_music_bars(img, cx, cy, bar_w=75, gap=35)
    
    # Add a subtle ring around the bars
    draw = ImageDraw.Draw(img)
    ring_color = (255, 255, 255, 30)
    draw.ellipse(
        [cx - 260, cy - 260, cx + 260, cy + 260],
        outline=ring_color,
        width=3
    )
    draw.ellipse(
        [cx - 300, cy - 300, cx + 300, cy + 300],
        outline=(255, 255, 255, 15),
        width=2
    )
    
    # Save icon.png
    img.save('/home/tweenty/SoundWave/assets/icon.png')
    print("icon.png generated!")
    
    # Save adaptive-icon.png (with safe zone padding)
    adaptive = Image.new('RGBA', (SIZE, SIZE), (13, 13, 26, 255))
    # Center the icon with padding for safe zone
    icon_size = int(SIZE * 0.7)
    resized = img.resize((icon_size, icon_size), Image.LANCZOS)
    offset = (SIZE - icon_size) // 2
    adaptive.paste(resized, (offset, offset), resized)
    adaptive.save('/home/tweenty/SoundWave/assets/adaptive-icon.png')
    print("adaptive-icon.png generated!")

    # Save splash-icon.png
    splash_w, splash_h = 1284, 2778
    splash = Image.new('RGBA', (splash_w, splash_h), (13, 13, 26, 255))
    splash_icon_size = 300
    splash_icon = img.resize((splash_icon_size, splash_icon_size), Image.LANCZOS)
    sx = (splash_w - splash_icon_size) // 2
    sy = (splash_h - splash_icon_size) // 2 - 100
    splash.paste(splash_icon, (sx, sy), splash_icon)
    splash.save('/home/tweenty/SoundWave/assets/splash-icon.png')
    print("splash-icon.png generated!")

    # favicon.png (small)
    favicon = img.resize((48, 48), Image.LANCZOS)
    favicon.save('/home/tweenty/SoundWave/assets/favicon.png')
    print("favicon.png generated!")

create_icon()
