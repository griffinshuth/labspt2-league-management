import React, { Component } from 'react';
import DashboardNavbar from './DashboardNavbar';
import ChooseLeague from '../CreateLeague/ChooseLeague';
// import Billing from '../Billing/Billing';
// import AppContext from '../Context/AppContext';

class HomeDashboard extends Component {
  state = {
    admin: false,
    coach: false,
    chooseLeague: false
  };

  displayBilling = e => {
    e.preventDefault();
    this.setState({ chooseLeague: !this.state.chooseLeague });
  };

  render() {
    const { chooseLeague } = this.state;
    return (
      <>
        <DashboardNavbar
          data={this.state}
          username={this.props.username}
          displayBilling={this.displayBilling}
          context={this.props.context}
        />
        <div
          style={{
            margin: '100px 40px 20px 280px'
          }}
        >
          {chooseLeague && <ChooseLeague />}
        </div>
      </>
    );
  }
}

export default HomeDashboard;
