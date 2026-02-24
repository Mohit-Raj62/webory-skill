import React from 'react'
import './Contact.css'
import {MdCall} from 'react-icons/md'
// import {BsFillChatDotsFill} from 'react-icons/bs'
import {HiChatBubbleBottomCenter} from 'react-icons/hi2'
import { MdEmail } from "react-icons/md";
import { FaWhatsappSquare } from "react-icons/fa";


const Contact = () => {
  return (
    <section className='c-wrapper'>
      <div className="paddings innerWidth flexCenter c-container">
        {/* left side */}
        <div className="flexColStart c-left">
          <span className='orangeText'>Our Contact</span>
          <span className='primaryText'>Easy to Contact</span>
          <span className='secondaryText'>We always ready to help by providing the best services for you. We believe a good place to live can make your life better</span>
          <div className="flexCenter stat">
            <div className="flexColCenter">
              <span className='primaryText'>50+</span>
              <span className='secondaryText'>Happy Customers</span>
            </div>
            <div className="flexColStart contactModes">
                {/* first row */}
                <div className="flexStart row">
                    <div className="flexColCenter mode">
                        <div className="flexStart">
                            <div className="flexCenter icon">
                                <MdCall size={25}/>
                                <img src="./call.png" alt="" />
                            </div>
                            <div className="flexColStart detail">
                                <span className='primaryText'>Call</span>
                                <span className='secondaryText'>021 123 145 14</span>
                            </div>
                        </div>
                        <div className="flexCenter button">
                           <a href=""><button className='button'>Call Now</button></a>
                        </div>
                    </div>
                    {/* second mode */}
                    <div className="flexColCenter mode">
                        <div className="flexStart">
                            <div className="flexCenter icon">
                            <FaWhatsappSquare size={35} />
                            </div>
                            <div className="flexColStart detail">
                                <span className='primaryText'>Chat</span>
                             
                            </div>
                        </div>
                        <div className="flexCenter button">
                            <a href="https://whatsapp.com/channel/0029Vb3Cd5JFnSzHB0i0on04"><button className='button'>Chat Now</button></a>
                        </div>
                    </div>
                </div>
                {/* second row */}
                <div className="flexStart row">
                    <div className="flexColCenter mode">
                        <div className="flexStart">
                            <div className="flexCenter icon">
                            <HiChatBubbleBottomCenter size={25}/>
                                {/* <img src="./message.png" alt="" /> */}
                            </div>
                            <div className="flexColStart detail">
                                <span className='primaryText'>Message</span>
                                <span className='secondaryText'>021 123 145 14</span>
                            </div>
                        </div>
                        <div className="flexCenter button">
                            <a href=""><button className='button' >Message Now</button></a>
                        </div>
                    </div>
                    <div className="flexColCenter mode">
                        <div className="flexStart">
                            <div className="flexCenter icon">
                            <MdEmail size={25}/>
                            </div>
                            <div className="flexColStart detail">
                                <span className='primaryText'>Email</span>
                                <span className='secondaryText'></span>
                            </div>
                        </div>
                        <div className="flexCenter button">
                           <a  href="mailto:mohit9470sinha@gmail.com"><button className='button'>Email now</button></a>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
        {/* right side */}
        <div className="flexCenter c-right">
          <div className="image-container">
            <img src="./contact.jpg" alt="" />
          </div>
        </div>
      </div>

    </section>
  )
}

export default Contact