
import './contact.css'
import aboutimg from "../../assets/aboutimg.svg";
import email from "../../assets/email.svg";
import phone from "../../assets/phone.svg";
import loca from "../../assets/location.svg";


const Contact = () => {
    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    
        formData.append("access_key", "d09fe9f8-a093-4660-ad6c-321fe653faa2");
    
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
    
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: json
        }).then((res) => res.json());
    
        if (res.success) {
          alert("Message sent successfully");
        }
      };
  return (
    <div id='contact' className='contact'>
        <div className="contact-title">
            <h1>Get In Touch</h1>
            <img src={aboutimg} alt="" />
        </div>
        <div className="contact-section">
            <div className="contact-left">
                <h1> Let&#39;s talk</h1> 
                <p>I am currently available to take on new projects, so feel free to send me a message about anything that you want me to work on. You can also check out my resume and other projects.</p>
                <div className="contact-details">
                    <div className="contact-detail">
                        <img src={phone} alt="" />
                        <p>+91 6205-947-359</p>
                    </div>
                    <div className="contact-detail">
                        <img src={email} alt="" />
                        <p>singm2698@gmail.com</p>
                    </div>
                    <div className="contact-detail">
                        <img src={loca} alt="" />
                        <p>Patna India,Bihar </p>
                    </div>
                </div>
            </div>
            <form onSubmit={onSubmit} className="contact-right">
                <label htmlFor="">Name</label>
                <input type="text" placeholder='Enter your name' name='name' />
                <label htmlFor="">Email</label>
                <input type="email" placeholder='Enter your email' name='email' />
                <label htmlFor="">Write Your Message Here</label>
                <textarea name="message" rows="8" placeholder='Enter your message'></textarea>
                <button type='submit' className='contact-submit'>Submit</button>
            </form>
        </div>
    </div>
  )
}

export default Contact