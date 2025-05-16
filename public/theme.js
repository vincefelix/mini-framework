// Gestion du thème (clair/sombre)
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Vérifier si un thème est stocké dans localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Appliquer le thème sauvegardé ou utiliser le thème sombre par défaut
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
    
    // Gérer le changement de thème
    themeToggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            // Passer au thème clair
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            // Passer au thème sombre
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});