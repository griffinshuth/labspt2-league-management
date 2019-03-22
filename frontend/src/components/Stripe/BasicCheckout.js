import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

class BasicCheckout extends Component {
  onToken = token => {
    console.log('basic token', token);
    const endpoint =
      process.env.NODE_ENV === 'production'
        ? 'https://league-management.herokuapp.com/stripe/billing'
        : 'http://localhost:4000/stripe/billing';

    axios
      .post(endpoint, token)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log('Error in axios call to backend', err);
      });
  };

  render() {
    return (
      <StripeCheckout
        stripeKey="pk_test_VcEhOLfFL76sBbdyEX8npTmN"
        // billingAddress
        description="Basic League"
        locale="auto"
        token={this.onToken}
        label="Create League"
        panelLabel="subscribe for $5/mo"
      />
    );
  }
}

export default BasicCheckout;
