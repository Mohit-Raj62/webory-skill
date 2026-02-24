import React from 'react'
import Layout from '../components/Layout/Layout'
import { Link } from 'react-router-dom'

const Info = () => {
    return (
        <Layout>
            <div className="pnf">
                <h1 className='pnf-heading04'>ROYAL GLOW</h1>
                <p className='pnf-heading04'>Version 1.01.00.19</p>
                <h1 className='pnf-titley'>R</h1>
                <p className='pnf-heading04'> &copy;2023 Royal Glow </p>
                <Link to='/' className='pnf-btn'>Go Back</Link>
            </div>
        </Layout>
    )
}

export default Info