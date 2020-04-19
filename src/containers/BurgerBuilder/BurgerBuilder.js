import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerActions from '../../store/actions/index';
import axios from '../../axios-orders';


const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();
    
    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const price = useSelector(state =>  state.burgerBuilder.totalPrice);
    const error = useSelector(state =>  state.burgerBuilder.error);
    const isAuthenticated = useSelector(state =>  state.auth.token !== null);

    const onIngredientAdded = ingName => dispatch(burgerActions.addIngredient(ingName));
    const onIngredientRemoved = ingName => dispatch(burgerActions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(burgerActions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(burgerActions.purchaseInit());
    const onSetAuthRedirectPath = path => dispatch(burgerActions.setAuthRedirectPath(path));

    

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients])
    const updatePurchaseState = (ingredients) => {
         const sum = Object.keys(ingredients).map(igKey => {
             return ingredients[igKey];
         }).reduce((sum, el) => {
            return sum + el;
         }, 0);
         return sum > 0;
     }

    const purchaseHandler = () => {
        if(isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }
    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }
    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout')
    }
    
        const disabledInfo = {
            ...ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = error ? <p style={{textAlign: 'center'}}>Ingredients can't be loaded..!</p> : <Spinner />;
        if (ings) {
            burger = (                
                <Aux>
                    <Burger ingredients={ings} />
                    <BuildControls
                        ingAdded={onIngredientAdded}
                        ingRemoved={onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={updatePurchaseState(ings)}
                        price={price}
                        ordered={purchaseHandler} 
                        isAuth={isAuthenticated}/>
                </Aux>
                );
            orderSummary = <OrderSummary 
                            ingredients={ings}
                            price={price} 
                            purchaseCancelled={purchaseCancelHandler}
                            purchaseContinued={purchaseContinueHandler}/>;
        }
        return ( 
            <Aux>
                <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
         );
    
}

export default withErrorHandler(BurgerBuilder, axios);