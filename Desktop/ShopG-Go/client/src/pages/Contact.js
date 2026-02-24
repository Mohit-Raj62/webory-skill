import React from 'react'
import Layout from './../components/Layout/Layout';
import { BiMailSend, BiPhoneCall, BiServer } from 'react-icons/bi'

const contact = () => {
    return (
        <Layout title={'Contact Us Mi Zip'}>
            <div className="row contactus">
                <div className="col-md-6">
                    <img
                        src='/images/contact.png'
                        alt='contactus'
                        style={{ width: '100%' }}
                    />
                </div>
                <div className="col-md-4">
                    <h1 className='bg-dark p-2 text-white text-center'>CONTACT US</h1>

                    <p className='text-justify mt-2'>
                        If any query and info product feel free to call anytime we 24x7 available your help!
                    </p>
                    <p className='mt-3'>
                        <BiMailSend />:help@onlshopg.com
                    </p>
                    <p className='mt-3'>
                        <BiPhoneCall />: +234 803 123 4567
                    </p>
                    <p className='mt-3'>
                        <BiServer />: www.onlineshopg.com
                    </p>


                </div>
            </div>
        </Layout>
    )
}

export default contact