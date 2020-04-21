import React from 'react';
import classes from './Modal.module.scss';
import './Modal.scss';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';
import CSSTransition from 'react-transition-group/CSSTransition';

const animationTiming = {
    enter: 400,
    exit: 600
}

const Modal = props => {
    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    // }

    return (
        <Aux>
            <Backdrop show={props.show} clicked={props.modalClosed} />
            <CSSTransition
                in={props.show}
                timeout={animationTiming}
                unmountOnExit
                mountOnEnter
                classNames="modalWrapper">
                <div className={classes.Modal} >
                    {props.children}
                </div>
            </CSSTransition>
        </Aux>

    );

}

export default React.memo(
    Modal,
    (prevProps, nextProps) =>
        nextProps.show === prevProps.show ||
        nextProps.children === prevProps.children
);