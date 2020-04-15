import React from 'react';
import classes from './Burger.module.scss';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const Burger = (props) => {
    let transIngredients = Object.keys(props.ingredients)
        .map( igKey => {
            return [...Array( props.ingredients[igKey] )].map( ( _, i)=> {
                return <BurgerIngredient  key={igKey + i} type={igKey}/>
            }) 
        }).reduce((arr, el) => { 
            return arr.concat(el)
        }, []);
        // console.log(transIngredients);
        if (transIngredients.length === 0) {
            transIngredients = <p>Please start adding Ingredients!</p>
        }
    return ( 
        <div className={classes.Burger}>
            <BurgerIngredient  type="bread-top" />
            {transIngredients}
            <BurgerIngredient  type="bread-bottom" />
        </div>
     );
}
 
export default Burger;