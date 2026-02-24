import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';


const PagenotFound = () => {
    return (
        <Layout title={"404 ! Mi Zip"}>
            <div className="pnf">
                <h1 className='pnf-title'>404</h1>
                <h2 className='pnf-heading' >Oops ! The page you are looking for does not exist.</h2>
                <Link to='/' className='pnf-btn' >Go Back</Link>
            </div>
        </Layout>
    );
};

export default PagenotFound;





