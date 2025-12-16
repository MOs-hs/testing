// Quick fix to reset language to English
// Run this in browser console or add as a script

// Clear all i18n related localStorage
localStorage.removeItem('i18nextLng');

// Set to English
localStorage.setItem('i18nextLng', 'en');

// Set document direction
document.documentElement.dir = 'ltr';
document.documentElement.lang = 'en';

// Reload page
window.location.reload();
