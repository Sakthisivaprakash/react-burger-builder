import React, {Component} from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.scss';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as orderActions from '../../../store/actions/index';

class ContactData extends Component {
    state = { 
        orderForm: {            
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    // maxLength: 5
                },
                valid: false,
                touched: false
            },        
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },               
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                
                touched: false
            },        
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options:[
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        },
        formIsValid: false
     }
    orderHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for(let formElIdentity in this.state.orderForm) {
            formData[formElIdentity] = this.state.orderForm[formElIdentity].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }
        this.props.onOrderBurger(order);
        // console.log(this.props.ingredients);
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true; // For validation not configured also
        }
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }
    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updatedFormElement =  {
            ...updatedOrderForm[inputIdentifier]
        }
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value,updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        // console.log(updatedFormElement);
        let formIsValid = true; // Over all form validity
        for(let inputIdentifier in updatedOrderForm) {
           formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
        // console.log(event.target.value);
    }
    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {/* <Input elementType="..." elementConfig="..." value="..."/> */}
                {formElementsArray.map(formElement => (
                   <Input
                        key={formElement.id} 
                        elementType={formElement.config.elementType} 
                        elementConfig={formElement.config.elementConfig} 
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}/> 
                ))}
                {/* <Input inputtype="input" type="text" name="name" placeholder="Your name" />
                <Input inputtype="input" type="text" name="email" placeholder="Your email" />
                <Input inputtype="input" type="text" name="street" placeholder="Your street" />
                <Input inputtype="input" type="text" name="postal" placeholder="Postal Code" /> */}
                <div className={classes.btnCont}>
                    <Button btnType="Success" disabled={!this.state.formIsValid}>Order</Button>
                </div>
            </form>
        );
        if (this.props.loading) {
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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData) => dispatch(orderActions.purchaseBurger(orderData))
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));