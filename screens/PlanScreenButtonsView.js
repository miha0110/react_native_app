import React from 'react';
import PropTypes from 'prop-types';
import { View, Text} from 'react-native';
import ViewPropTypes from 'react-native';

const PlanScreenButtonsView = (props) => {
  const { children, hide, style } = props;
  if (hide) {
    return null;
  }
  return (
    <View {...this.props} style={style}>
      { children }
    </View>
  );
};

PlanScreenButtonsView.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element,
    ])),
  ]).isRequired,
  style: ViewPropTypes.style,
  hide: PropTypes.bool,
};


export default PlanScreenButtonsView;
