import React from 'react';
import classes from './Logo.module.scss';
import burderLogo from '../../assets/images/burder-logo.png';

const logo = (props) => {
    return ( 
        // style={{height: props.height}}
        <div className={classes.Logo}>
            <img src={burderLogo} alt="MyBurger" />
        </div>
     );
}
 
export default logo;