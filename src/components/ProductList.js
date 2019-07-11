import React, { Component } from 'react';
import Product from './Product';
import {storeProducts} from "../data";
import Title from './Title';
import {ProductConsumer} from '../context';

export default class ProductList extends Component {
    state={
        product: storeProducts
    }
    render() {
        return (
            <React.Fragment>
                <div className="py-5">
                    <div className="container">
                        <Title name='Our' title="Products" />
                        <div className="row">
                            <ProductConsumer>
                                {value => {
                                    return value.products.map(products =>{
                                        return <Product key={products.id} item={products}/>
                                    })
                                    
                                }}
                            </ProductConsumer>
                        </div>    
                        
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
