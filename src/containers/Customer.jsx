import React, {Component} from 'react';

class Customer extends Component{
    constructor(){
        super();
        this.customers = [
            {
                id: 0,
                name: "Jason Marketing",
                price: {
                    XL: { case: 200, tray: 100 },
                    L: { case: 150, tray: 50 },
                    M: { case: 100, tray: 20 }
                }
            },
            {
                id: 1,
                name: "SBJ Tracking",
                price: {
                    goodCrackBig: { case: 50 },
                    juice: { case: 15 },
                    plasticEgg: { kilo: 10 }
                }
            }
        ];
    }
    
    render(){
        return(
            <div></div>
        );
    }
}

export default Customer;
