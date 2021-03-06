import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Link, Redirect } from 'react-router-dom';
import HomeDrawer from './HomeDrawer';
import AdminDrawer from './AdminDrawer';
import CoachDrawer from './CoachDrawer';
import { AppContext } from '../Context/AppContext';
import WeatherWidget from '../Weather/WeatherWidget';
// import AppContext from '../Context/AppContext';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    backgroundColor: '#333',
    [theme.breakpoints.up('sm')]: {
      // width: `calc(100% - ${drawerWidth}px)`
      width: '100%',
      zIndex: theme.zIndex.drawer + 1
    }
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  button: {
    color: 'white'
    // border: '1px solid white'
  },
  // toolbar: theme.mixins.toolbar,
  toolbar: {
    height: 63,
    textAlign: 'right'
  },
  closeButton: {
    cursor: 'pointer',
    padding: 15,
    paddingLeft: 35,
    fontSize: '2rem'
  },
  drawerPaper: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  selected: {
    color: 'white',
    borderBottom: '1px solid white',
    borderRadius: 0
  },
  nested: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 40
  }
});

class MenuAppBar extends React.Component {
  state = {
    anchorEl: null,
    mobileOpen: false,
    // admin: false,
    // coach: false,
    leagues: [], // global
    teams: [], // global
    logout: false,
    settings: false
  };

  getLeagues() {
    const token = localStorage.getItem('jwt') || this.props.context.signOut();
    const endpoint = '/leagues';
    const options = {
      headers: {
        authorization: token
      }
    };
    axios
      .get(endpoint, options)
      .then(res => {
        this.setState({ leagues: res.data });
      })
      .catch(err => {
        console.log('error from getLeagues', err);
      });
  }

  getTeams() {
    const token = localStorage.getItem('jwt') || this.props.context.signOut();
    const endpoint = '/teams';
    const options = {
      headers: {
        authorization: token
      }
    };
    axios
      .get(endpoint, options)
      .then(res => {
        this.setState({ teams: res.data });
      })
      .catch(err => {
        console.log('error from getTeams', err);
      });
  }

  componentDidMount() {
    const token = localStorage.getItem('jwt') || this.props.context.signOut();

    if (token) {
      this.props.context.signin();
      this.getLeagues();
      this.getTeams();
    }

    // This is where an axios request would be done to get the user's info so the correct leagues and teams show up in the lists.
    // state would also include user settings, and other info on the user (global state?)
    const { admin, coach } = this.props.data;
    this.setState({
      admin,
      coach
    });
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ [event.currentTarget.id]: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, mobileOpen: false });
  };

  handleSettings = () => {
    this.setState({ settings: !this.state.settings });
    this.handleClose();
  };

  handleClick = e => {
    this.setState({ [e.currentTarget.id]: !this.state[e.currentTarget.id] });
  };

  logout = () => {
    localStorage.removeItem('jwt');
    this.setState({ logout: true });
    this.props.context.signOut();
  };

  render() {
    const { classes, theme } = this.props;
    const { anchorEl, mobileOpen, admin, coach, leagues, teams } = this.state;
    const open = Boolean(anchorEl);

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          {mobileOpen ? (
            <CloseIcon
              className={classes.closeButton}
              onClick={this.handleDrawerToggle}
            />
          ) : null}
        </div>
        <Divider />
        {!admin && !coach && (
          <HomeDrawer
            classes={classes}
            leagues={leagues}
            teams={teams}
            handleClose={this.handleClose}
            displayBilling={this.props.displayBilling}
            getLeagues={this.getLeagues}
          />
        )}
        {admin && !coach && (
          <AdminDrawer
            handleClose={this.handleClose}
            displayAdminContent={this.props.displayAdminContent}
          />
        )}
        {coach && !admin && (
          <CoachDrawer
            handleClose={this.handleClose}
            displayCoachContent={this.props.displayCoachContent}
          />
        )}
      </div>
    );

    if (this.state.logout) {
      return <Redirect to="/" />;
    }

    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              onClick={this.handleDrawerToggle}
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              <Link to="/" style={{ color: '#fff' }}>
                League Management
              </Link>
            </Typography>
            <AppContext.Consumer>
              {context => (
                <Typography
                  variant="h6"
                  color="inherit"
                  className={classes.grow}
                >
                  {context.state.username}
                </Typography>
              )}
            </AppContext.Consumer>
            <WeatherWidget />
            <Link to="/dashboard">
              <Button
                className={!admin && !coach ? classes.selected : classes.button}
                onClick={this.homeView}
              >
                Home
              </Button>
            </Link>

            <div>
              <IconButton
                id="anchorEl"
                aria-owns={open ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleSettings}>
                  <Link to="/settings">Account Settings</Link>
                </MenuItem>
                <MenuItem onClick={this.handleClose}>
                  Billing Information
                </MenuItem>

                <MenuItem onClick={this.logout}>Log Out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>

        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={this.props.container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MenuAppBar);
