import React from 'react'
import './Getstarted.css'

const Getstarted = () => {
  return (
    <section className="g-wrapper">
        <div className="paddings innerWidth g-container">
            <div className="flexColCenter inner-container">
                <span className="primaryText">Get started with HARMONY
                  {/* <span className='r-st'>real Estate</span> */}
                   </span>
                <span className="secondaryText">Subscribe and find super attractive price quotes from us.
                <br/>
                Find your residence soon</span>
                <button className="button">
                    <a href="mailto:mohit9470sinha@gmail.com">Get Started</a>
                </button>
            </div>
        </div>
    </section>
  )
}

export default Getstarted