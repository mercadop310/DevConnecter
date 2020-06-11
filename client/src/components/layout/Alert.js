import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

/* 
    We want to get the state inside of the alert in the root reducer.
    the key is the name you want for state in your props, and the value is the state in the root reducer that is wanted
*/

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
