import React from 'react'
import Layout from './../components/Layout/Layout'

const About = () => {
    return (
        <Layout title={'About Us Mi Zip'} >
            <div className="row contactus">
                <div className="col-md-6">
                    <img
                        src="/images/about.png"
                        alt='About Me'
                        style={{ width: '100%' }}
                    />
                </div>
                <div className="col-md-4">
                    <h1 className='bg-dark p-2 text-white text-center'>About US</h1>
                    <p className="text-justify mt-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis similique aut veniam nihil. Quo, dignissimos ex tenetur dolores dolorum obcaecati laboriosam facere voluptatem velit molestiae eius asperiores adipisci. Beatae, laboriosam.
                    </p>
                </div>
            </div>

        </Layout>
    )
}

export default About