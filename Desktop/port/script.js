// Smooth Scroll for Navigation Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Validation and Submission Alert
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Simple validation
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name === '' || email === '' || message === '') {
        alert('Please fill in all required fields.');
        return;
    }

    // If validation passes, show a confirmation alert
    alert('Thank you, ' + name + '! Your message has been sent.');

    // Optionally, you can reset the form
    this.reset();
});
<div>
  <section className="hero">
    <h1>Crafting Unique Visual Identities</h1>
    <a href="#contact" className="cta-button">Get a Quote</a>
  </section>
  <section id="about">
    <h2>About Me</h2>
    <img src="profile.jpg" alt="[Your Name]" className="profile-pic" />
    <p>Hi! I'm [Your Name], a freelance graphic designer specializing in branding and web design. My passion lies in creating unique visual identities that resonate with audiences.</p>
    <h3>Skills</h3>
    <ul>
      <li>Branding</li>
      <li>Web Design</li>
      <li>Typography</li>
      <li>Adobe Creative Suite</li>
    </ul>
  </section>
  <section id="portfolio">
    <h2>Portfolio</h2>
    <div className="portfolio-grid">
      <div className="portfolio-item">
        <img src="project1.jpg" alt="Project 1" />
        <h3>Project Title 1</h3>
        <p>Brief description of the project and your role.</p>
      </div>
      <div className="portfolio-item">
        <img src="project2.jpg" alt="Project 2" />
        <h3>Project Title 2</h3>
        <p>Brief description of the project and your role.</p>
      </div>
      {/* Add more portfolio items as needed */}
    </div>
  </section>
  <section id="contact">
    <h2>Contact</h2>
    <form>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" required />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required />
      <label htmlFor="subject">Subject:</label>
      <input type="text" id="subject" name="subject" />
      <label htmlFor="message">Message:</label>
    </form></section></div>
