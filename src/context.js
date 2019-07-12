import React, { Component } from 'react';
import {storeProducts,detailProduct} from './data';

const ProductContext = React.createContext();
class ProductProvider extends Component {
    state={
        products:[],
        detailProduct:detailProduct,
        cart:[],
        modalOpen:false,
        modalProduct:detailProduct,
        cartSubTotal:0,
        cartTax:0,
        cartTotal:0
    };
    componentDidMount(){
        this.setProducts();
    }
    setProducts= ()=>{
        let tempProduct=[];
        storeProducts.forEach((item)=>{
                const singleItem={...item};
                tempProduct=[...tempProduct,singleItem];
        })
        this.setState(()=>{
         return{products:tempProduct}
        })
    }

    getItem = (id)=>{
        const product = this.state.products.find(item=> item.id===id);
        return product;
    }
    handleDetail = (id) =>{
        const product = this.getItem(id);
        this.setState(()=>{
            return{detailProduct:product};
        });
    };
    addToCart =(id) =>{
        let tempProducts= [...this.state.products];
        const index = tempProducts.indexOf(this.getItem(id));
        const product = tempProducts[index];
        product.inCart = true;
        product.count = 1;
        const price = product.price;
        product.total = price;
        this.setState(()=>{
            return{cart:[...this.state.cart,product]}
        },()=>{
            this.addTotal();
        })
    };
    openModal = id=>{
        const product=this.getItem(id);
        this.setState(()=>{
            return{modalProduct:product,modalOpen:true};
        })
    }
    closeModal = ()=>{
        this.setState(()=>{
            return{modalOpen:false}
        })
    }
    increment =(id)=>{
        let tempCart = [...this.state.cart];
        const selectedProducts = tempCart.find(item=>item.id === id)
        const index =tempCart.indexOf(selectedProducts);
        const product = tempCart[index];
        product.count = product.count + 1;
        product.total = product.count * product.price;
        this.setState(()=>{
            return{cart:[...tempCart]}
        },()=>{this.addTotal()})
        
    }
    decrement =(id)=>{
        let tempCart = [...this.state.cart];
        const selectedProducts = tempCart.find(item=>item.id === id)
        const index =tempCart.indexOf(selectedProducts);
        const product = tempCart[index];
        
        if((product.count) == 0){
            this.removeItem(id);
        } 
        else{
            product.count=product.count-1;
            product.total = product.count * product.price;
        } 
        this.setState(()=>{
            return{cart:[...tempCart]}
        },()=>{this.addTotal()})  
        
    }
    removeItem =(id)=>{
        let tempProduct = [...this.state.products];
        let tempCart = [...this.state.cart];
        tempCart = tempCart.filter(item=> item.id!==id);
        const index = tempProduct.indexOf(this.getItem(id));
        let removedProduct = tempProduct[index];
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;

        this.setState(()=>{
            return{
                cart:[...tempCart],
                products:[...tempProduct]
            }
        })
    }
    clearCart =()=>{
        this.setState(()=>{
            return{cart:[]}
        },()=>{
            this.setProducts(); 
            this.addTotal();   
        })
        
    }
    addTotal =()=>{
        let cartSubTotal = 0;
        this.state.cart.map(item =>{
            cartSubTotal+=item.total
        })
        const tempTax = cartSubTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));
        const total = cartSubTotal + tax;
        this.setState(()=>{
            return{
                cartSubTotal,
                cartTax:tax,
                cartTotal:total
            }
        })
    }
    
    

    render() {
        return (
            <ProductContext.Provider value={{
              ...this.state,
              handleDetail:this.handleDetail,
              addToCart:this.addToCart,
              openModal:this.openModal,
              closeModal:this.closeModal,
              increment:this.increment,
              decrement:this.decrement,
              removeItem:this.removeItem,
              clearCart:this.clearCart      
            }}>
                {this.props.children}
            </ProductContext.Provider>       
            
        );
    }
}

const ProductConsumer = ProductContext.Consumer;

export{
    ProductProvider, ProductConsumer
};
