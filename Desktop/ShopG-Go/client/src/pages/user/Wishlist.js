import React from 'react'
import UserMenu from '../../components/Layout/UserMenu'
import Layout from '../../components/Layout/Layout'

const Wishlist = () => {
    return (
        <Layout title={"Dash Wishlist Mi Zip"}>
            < div className='container-fluid m-3 p-3' >
                <div className='row'>
                    <div className='col-md-3' >
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>Wishlist</h1>
                    </div>
                </div>
            </div >
        </Layout >
    )
}

export default Wishlist