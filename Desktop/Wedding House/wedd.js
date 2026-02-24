// script.js

// Add event listener to the navbar links
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', event => {
    event.preventDefault();
    const href = link.getAttribute('href');
    const section = document.querySelector(href);
    section.scrollIntoView({ behavior: 'smooth' });
    });
    });
    
    // Add event listener to the sidebar links
    document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', event => {
    event.preventDefault();
    const href = link.getAttribute('href');
    const section = document.querySelector(href);
    section.scrollIntoView({ behavior: 'smooth' });
    });
    });