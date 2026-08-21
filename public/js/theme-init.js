// Immediate Theme Hydration to prevent theme flicker
    const savedTheme = localStorage.getItem('sree_krushna_theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
