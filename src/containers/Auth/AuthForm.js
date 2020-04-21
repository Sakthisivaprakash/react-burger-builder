import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import styles from './Auth.module.scss';
import * as actions from '../../store/actions/index';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import AppButton from '../../components/UI/AppButton/AppButton';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100%',
        },
    }
}));

const Auth = props => {
    const [isSignup, setIsSignup] = useState(true);

    const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;
    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath])

    // const submitHandler = (event) => {
    //     event.preventDefault();
    //     props.onAuth(authForm.email.value, authForm.password.value, isSignup);
    //     // console.log('id: ' + authForm.email.value, 'pass: ' + authForm.password.value);
    // }

    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
    }
    const matClasses = useStyles();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'), 
            password: Yup.string()                
                .required('Required'),
        }),
        onSubmit: values => {
            props.onAuth(values.email, values.password, isSignup);
            // alert(JSON.stringify(values, null, 2));
            // alert(values.name);
        }
    });
    let form = (
        <React.Fragment>
            <TextField
                label="Email"
                variant="outlined"
                type="text"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.touched.email && formik.errors.email) ? true : false}
                helperText={(formik.touched.email && formik.errors.email) ? formik.errors.email : null} />
            <TextField
                label="Password"
                variant="outlined"
                type="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.touched.password && formik.errors.password) ? true : false}
                helperText={(formik.touched.password && formik.errors.password) ? formik.errors.password : null} />
        </React.Fragment>
    )

    if (props.loading) {
        form = <Spinner />
    }

    let errorMessage = null;

    if (props.error) {
        errorMessage = (
            <p className={styles.error}>{props.error.message}</p>
        );
    }

    let authRedirect = null;
    if (props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath} />
    }
    return (
        <div className={styles.Auth}>
            <h3>{!isSignup ? 'SIGNIN' : 'SIGNUP'}</h3>
            {authRedirect}
            {errorMessage}
            <form className={matClasses.root} onSubmit={formik.handleSubmit} autoComplete>
                {form}
                <div>
                    <AppButton color="primary" type="submit" disabled={!(formik.isValid && formik.dirty)}>
                        SUBMIT
                    </AppButton>
                    {/* <Button btnType="Success">SUBMIT</Button> */}
                </div>
            </form>
            <Button
                btnType="Danger"
                clicked={switchAuthModeHandler}>
                SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}
            </Button>
        </div>
    );

}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Auth);

