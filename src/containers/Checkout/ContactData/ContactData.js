import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.scss';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
    state = { 
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
     }
    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true})
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'sakthi',
                address: {
                    street: 'Velmurugan nagar',
                    zipCode: '638506',
                    country: 'India'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                // console.log(response);
                this.props.history.push('/');
                this.setState({ loading: false});
            })
            .catch(error => {
                console.log(error);
                this.setState({ loading: false});
            });
        // console.log(this.props.ingredients);
    }
    render() {
        let form = (
            <form>
                <input type="text" name="name" placeholder="Your name" />
                <input type="text" name="email" placeholder="Your email" />
                <input type="text" name="street" placeholder="Your street" />
                <input type="text" name="postal" placeholder="Postal Code" />
                <div className={classes.btnCont}>
                    <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
                </div>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />;
        }
        return ( 
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
         );
    }
}
 
export default ContactData;