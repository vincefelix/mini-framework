// Theme management (light/dark)
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    // Check if a theme is stored in localStorage
    const savedTheme = localStorage.getItem('theme');

    // Apply the saved theme or use dark theme by default
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }

    // Handle theme change
    themeToggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            // Switch to light theme
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark theme
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});