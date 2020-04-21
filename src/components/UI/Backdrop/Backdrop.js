import React from 'react';
import './Backdrop.scss';
import CSSTransition from 'react-transition-group/CSSTransition';

const animationTiming = {
    enter: 400,
    exit: 600
}

const backdrop = (props) => (
    <CSSTransition
    in={props.show}
    timeout={animationTiming}
    unmountOnExit
    mountOnEnter
    classNames="fade-backdrop">
        <div className="Backdrop" onClick={props.clicked}></div>
    </CSSTransition>
);
 
export default backdrop;