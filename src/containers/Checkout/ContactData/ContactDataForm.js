import React from 'react';
import { connect } from 'react-redux';
import classes from './ContactData.module.scss';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as orderActions from '../../../store/actions/index';

import AppButton from '../../../components/UI/AppButton/AppButton';
import { useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    selectControl: {
        margin: theme.spacing(1),
        width: '100%',
        textAlign: 'left'
      }
}));

const ContactData = props => {
    const matClasses = useStyles();

    const validate = values => {
        const errors = {};
        if (!values.name) {
          errors.name = 'Required';
        } else if (values.name.length > 15) {
          errors.name = 'Must be 15 characters or less';
        }
      
        if (!values.street) {
          errors.street = 'Required';
        } else if (values.street.length > 20) {
          errors.street = 'Must be 20 characters or less';
        }

        if (!values.zipCode) {
          errors.zipCode = 'Required';
        } else if (!/^\d+$/i.test(values.zipCode)) {           
          errors.zipCode = 'Invalid Zip code';
        } else if (values.zipCode.length > 6) {
          errors.zipCode = 'Must be 6 digits or less';
        }
                
        if (!values.country) {
          errors.country = 'Required';
        } else if (values.country.length > 20) {
          errors.country = 'Must be 20 characters or less';
        }
      
        if (!values.email) {
          errors.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
          errors.email = 'Invalid email address';
        }
      
        return errors;
      };
    const formik = useFormik({
        initialValues: {
            name: '',
            street: '',
            zipCode: '',
            country: '',
            email: '',
            deliveryMethod: 'fastest',
        },
        validate,
        onSubmit: values => {
            const order = {
                ingredients: props.ings,
                price: props.price,
                orderData: values,
                userId: props.userId
            }
            props.onOrderBurger(order, props.token);
            // alert(JSON.stringify(values, null, 2));
            // alert(values.name);
        }
    });
    let form = (
        <form className={matClasses.root} onSubmit={formik.handleSubmit} autoComplete="off">
            <TextField 
                label="Name" 
                variant="outlined" 
                type="text"
                name="name"                
                value={formik.values.name} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.touched.name && formik.errors.name) ? true : false}
                helperText={(formik.touched.name && formik.errors.name) ? formik.errors.name : null}/>
            <TextField 
                label="Street" 
                variant="outlined"
                type="text"
                name="street"
                onChange={formik.handleChange}
                value={formik.values.street}
                onBlur={formik.handleBlur}
                error={(formik.touched.street && formik.errors.street) ? true : false} 
                helperText={(formik.touched.street && formik.errors.street) ? formik.errors.street : null}/>

            <TextField 
                label="Zip Code" 
                variant="outlined"
                type="text"
                pattern="[0-9]*"
                name="zipCode"
                onChange={formik.handleChange}
                value={formik.values.zipCode}
                onBlur={formik.handleBlur}
                error={(formik.touched.zipCode && formik.errors.zipCode) ? true : false}
                helperText={(formik.touched.zipCode && formik.errors.zipCode) ? formik.errors.zipCode : null} />

            <TextField 
                label="Country" 
                variant="outlined"
                type="text"
                name="country"
                onChange={formik.handleChange}
                value={formik.values.country}
                onBlur={formik.handleBlur}
                error={(formik.touched.country && formik.errors.country) ? true : false}
                helperText={(formik.touched.country && formik.errors.country) ? formik.errors.country : null} />

            <TextField 
                label="Email" 
                variant="outlined"
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
                error={(formik.touched.email && formik.errors.email) ? true : false}
                helperText={(formik.touched.email && formik.errors.email) ? formik.errors.email : null} />

            <FormControl variant="outlined" className={matClasses.selectControl}>
                <InputLabel id="del-meth">Delivery Method</InputLabel>
                <Select
                    labelId="del-meth"                    
                    value={formik.values.deliveryMethod}
                    label="Delivery Method"
                    name="deliveryMethod"
                    onChange={formik.handleChange}                    
                >
                    <MenuItem value={'fastest'}>Fastest</MenuItem>
                    <MenuItem value={'cheapest'}>Cheapest</MenuItem>
                </Select>
            </FormControl>
            <div className={classes.btnCont}>
                <AppButton color="primary" type="submit" disabled={!(formik.isValid && formik.dirty)}>
                    Order
                </AppButton>
            </div>
        </form>
    );
    if (props.loading) {
        form = <Spinner />;
    }
    return (
        <div className={classes.ContactData}>
            <h4>Enter your Contact Data - Formik</h4>
            {form}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(orderActions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));