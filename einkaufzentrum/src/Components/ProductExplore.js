import React from 'react'
import '../Style/ProductExplore.css'
import ProductCard from './ProductCard'
import Footer from '../Components/Footer';

const ProductExplore = () => {
    const cards = new Array(9).fill(null);
    return (
        <div>
            <div className='explore'>
                <div>

                    <h2 className="section-title">Products you may like</h2>
                </div>

                <div className="products-grid">

                    {
                        cards.map((_, index) => {
                            return (<ProductCard key={index} />)
                        })
                    }


                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ProductExplore