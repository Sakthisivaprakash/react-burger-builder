import React, { useEffect, Suspense, useCallback } from 'react';
// eslint-disable-next-line
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import { useDispatch, useSelector } from 'react-redux';

import { orange } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';



const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
});
const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
});
// const Auth = React.lazy(() => {
//   return import('./containers/Auth/Auth');
// });
const AuthForm = React.lazy(() => {
  return import('./containers/Auth/AuthForm');
});

const theme = createMuiTheme({
  status: {
    danger: orange[500],
  },
});

const App = props => {
  const dispatch = useDispatch();

  const onTryAutoSignup = useCallback(() => dispatch(actions.authCheckState()), [dispatch]);
  const isAuthenticated = useSelector(state => state.auth.token !== null);

  useEffect(() => {
    onTryAutoSignup();
  }, [onTryAutoSignup]);

  let routes = (
    <AnimatedSwitch 
      atEnter={{ opacity: 0 }}
      atLeave={{ opacity: 0 }}
      atActive={{ opacity: 1 }}
      className="switch-wrapper">
      {/* <Route path="/auth" render={(props) => <Auth {...props} />} /> */}
      <Route path="/auth" render={(props) => <AuthForm {...props} />} />
      <Route exact path="/" component={BurgerBuilder} />
      <Redirect to="/" />
    </AnimatedSwitch>
  );

  if (isAuthenticated) {
    routes = (
      <AnimatedSwitch 
        atEnter={{ opacity: 0 }}
        atLeave={{ opacity: 0 }}
        atActive={{ opacity: 1 }}
        className="switch-wrapper">
        <Route path="/checkout" render={(props) => <Checkout {...props} />} />
        <Route path="/orders" render={(props) => <Orders {...props} />} />
        <Route path="/logout" component={Logout} />
        {/* <Route path="/auth" render={(props) => <Auth {...props} />} /> */}
        <Route path="/auth" render={(props) => <AuthForm {...props} />} />
        <Route exact path="/" component={BurgerBuilder} />
        <Redirect to="/" />
      </AnimatedSwitch>
    );
  }
  return (
    <div>
      <Layout>
      <ThemeProvider theme={theme}>
          <Suspense fallback={<p>Loading...</p>}>
            {routes}
          </Suspense>
        </ThemeProvider>
      </Layout>
    </div>
  );

}

export default withRouter(App);
