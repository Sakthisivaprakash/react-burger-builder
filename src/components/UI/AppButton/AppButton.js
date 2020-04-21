import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    background: (props) =>
      props.color === 'primary'
        ? 'linear-gradient(45deg, #bc581e 30%, #e27b36 90%)'
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: (props) =>
      props.color === 'primary'
        ? '0 3px 5px 2px rgba(112, 59, 9, .3)'
        : '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: 8,
    '&$disabled': {
        color: '#703b09', // https://material-ui.com/customization/components/#pseudo-classes
        background: '#ccc',
        boxShadow: 'none'
    }
  },
  disabled: {}
});

const AppButton = (props) => {
  const { color, ...other } = props;
  const matClasses = useStyles(props);
  return <Button classes={{
    root: matClasses.root,
    disabled: matClasses.disabled
  }} {...other} />;
}

AppButton.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary']).isRequired,
};

export default AppButton;