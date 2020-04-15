import React from 'react';
import classes from './Order.module.scss';

const order = (props) => {
    // console.log(props);
    const ingredients = [];
    for (let ingName in props.ingredients) {
        ingredients.push(
            {
                name: ingName , 
                amount: props.ingredients[ingName]
            }
            )
    }
    const ingredientOutput = ingredients.map(ig => {
        return <span 
                    className={classes.ingredient}
                    key={ig.name}>{ig.name} ({ig.amount})</span>;
    });
    return ( 
        <div className={classes.Order}>
            <p>Ingredients: {ingredientOutput}</p>
            <p>Price: <strong>USD {Number.parseFloat(props.price).toFixed(2)}</strong></p>
        </div>
     );
}
 
export default order;