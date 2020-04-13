import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as burgerActions from '../../store/actions/index';


class BurgerBuilder extends Component {
    state = { 
        purchasing: false,        
     }
     componentDidMount() {
        console.log(this.props);
        this.props.onInitIngredients();
     }
     updatePurchaseState(ingredients) {
         const sum = Object.keys(ingredients).map(igKey => {
             return ingredients[igKey];
         }).reduce((sum, el) => {
            return sum + el;
         }, 0);
         return sum > 0;
     }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout')
    }
    render() { 
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.props.error ? <p style={{textAlign: 'center'}}>Ingredients can't be loaded..!</p> : <Spinner />;
        if (this.props.ings) {
            burger = (                
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingAdded={this.props.onIngredientAdded}
                        ingRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        price={this.props.price}
                        ordered={this.purchaseHandler} />
                </Aux>
                );
            orderSummary = <OrderSummary 
                            ingredients={this.props.ings}
                            price={this.props.price} 
                            purchaseCancelled={this.purchaseCancelHandler}
                            purchaseContinued={this.purchaseContinueHandler}/>;
        }
        return ( 
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
         );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerActions.initIngredients()),
        onInitPurchase: () => dispatch(burgerActions.purchaseInit())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));