# LLM Liftoff - Online Course Selling Platform

LLM Liftoff is a modern, responsive website for selling online courses. It features a beautiful UI with advanced CSS animations and JavaScript interactivity.

## Features

- **Responsive Design**: Works perfectly on all devices (desktop, tablet, mobile)
- **Dynamic Header**: Changes appearance on scroll and provides smooth navigation
- **Course Showcase**: Display courses with attractive cards and hover effects
- **User Reviews**: Showcase testimonials from satisfied customers
- **FAQ Section**: Interactive accordion for frequently asked questions
- **Partner Logos**: Display trusted partners and collaborators
- **Newsletter Subscription**: Collect email addresses from interested visitors
- **Modern Animations**: Smooth transitions and reveal effects
- **Mobile-friendly Navigation**: Hamburger menu that transforms into an X

## Files

- `index.html`: The main HTML structure
- `styles.css`: All styling and animations
- `script.js`: JavaScript functionality and interactivity

## Running the Website

Simply open the `index.html` file in any modern web browser. No server or build process is required as this is a static website.

## Customization

### Adding New Courses

To add new courses, duplicate the course card structure in the HTML:

```html
<div class="course-card">
    <div class="course-image">
        <img src="your-image-url.jpg" alt="Course Title">
        <div class="course-tag">Tag Text</div>
    </div>
    <div class="course-content">
        <div class="course-info">
            <span class="course-level"><i class="fas fa-signal"></i> Level</span>
            <span class="course-rating"><i class="fas fa-star"></i> Rating</span>
        </div>
        <h3>Course Title</h3>
        <p>Course Description</p>
        <div class="course-footer">
            <div class="course-meta">
                <span><i class="fas fa-video"></i> Number of lessons</span>
                <span><i class="fas fa-clock"></i> Duration</span>
            </div>
            <div class="course-price">
                <span class="original-price">Original Price</span>
                <span class="discounted-price">Discounted Price</span>
            </div>
        </div>
    </div>
</div>
```

### Changing Colors

The website uses CSS variables for colors. You can easily change the color scheme by editing the `:root` section in the CSS file:

```css
:root {
    --primary-color: #4f46e5;
    --primary-color-dark: #4338ca;
    --primary-color-light: #a5b4fc;
    --secondary-color: #f97316;
    /* other variables */
}
```

## Browser Compatibility

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Credits

- Icons: [Font Awesome](https://fontawesome.com/)
- Fonts: [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins)
- Stock Images: [Unsplash](https://unsplash.com/)
- User Avatars: [Random User API](https://randomuser.me/) 