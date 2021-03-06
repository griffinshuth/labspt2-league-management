import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
// import axios from 'axios';

export const AppContext = React.createContext();

export default class AppProvider extends Component {
  state = {
    username: null,
    admin: false,
    coach: false,
    loggedIn: true,
    publicEvents: [
      {
        id: '1',
        start: 'mar 4 2019 10: 00: 00',
        end: 'mar 4 2019 12: 00: 00',
        title: 'Team 1 vs Team 2',
        location: 'Park'
      },
      {
        id: '2',
        start: 'mar 5 2019 12: 00: 00',
        end: 'mar 5 2019 14: 00: 00',
        title: 'Team 3 vs Team 4',
        location: 'Park'
      },
      {
        id: '3',
        start: 'mar 6 2019 10: 00: 00',
        end: 'mar 6 2019 12: 00: 00',
        title: ['Team 5 vs Team 6'],
        location: 'Park'
      }
    ],
    events: [
      {
        id: '1',
        start: 'mar 4 2019 10: 00: 00',
        end: 'mar 4 2019 12: 00: 00',
        title: 'Team 1 vs Team 2',
        location: 'Park'
      },
      {
        id: '2',
        start: 'mar 5 2019 12: 00: 00',
        end: 'mar 5 2019 14: 00: 00',
        title: 'Team 3 vs Team 4',
        location: 'Park'
      },
      {
        id: '3',
        start: 'mar 6 2019 10: 00: 00',
        end: 'mar 6 2019 12: 00: 00',
        title: 'Team 5 vs Team 6',
        location: 'Park'
      }
    ]
  };

  render() {
    const { events } = this.state;
    return (
      <AppContext.Provider
        value={{
          state: this.state,
          signin: () => {
            const token = localStorage.getItem('jwt');
            // let username = null;
            if (token) {
              const decoded = jwt_decode(token);
              // const username = decoded.user.username;
              // console.log('decoded jwt: ', decoded);
              this.setState({ loggedIn: true });
            }
          },
          signedIn: () => {
            this.setState({ loggedIn: true });
          },
          signOut: () => {
            this.setState({ loggedIn: false });
          },
          getEvents: id => {
            // An axios request will need to be done here to pull events from DB
            // this.setState({
            //   events: events
            // });
          },
          updateEvents: () => {
            // console.log('made it to context update function');

            const newEventsArr = JSON.parse(JSON.stringify(events));
            this.setState({ publicEvents: newEventsArr });

            // console.log('global events:', this.state.events);
            // do a put request to update the events on the DB
            // const updateDB = await axios.put()
          }
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
