import React from 'react'
import { Link } from 'react-router-dom';
import { FcInfo } from 'react-icons/fc';
import { MdOutlinePrivacyTip } from 'react-icons/md';
import { SiGnuprivacyguard } from 'react-icons/si';
import { IoMdContacts } from 'react-icons/io';

const Footer = () => {
    return (
        <div>
            <div className='footer'>
                <h4 className='text-center'>&copy;copyright 2023 | 
                All Right Received by RoyalGlow beauty product Pvt.Ltd.</h4>
                <p className='text-center mt-3'>
                    <Link to='/about' title='About'> <MdOutlinePrivacyTip /> </Link > |
                    <Link to="/contact" title='Contact'> <IoMdContacts /> </Link > |
                    <Link to="/policy" title='Privacy policy' > <SiGnuprivacyguard /> </Link > |
                    <Link to="/info" title='App info'><FcInfo /> </Link>
                </p>
            </div>
        </div>
    )
}

export default Footer