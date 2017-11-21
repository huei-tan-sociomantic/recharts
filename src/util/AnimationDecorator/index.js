/* eslint-disable no-param-reassign */

import PropTypes from './propTypes';
import DefaultProps from './defaultProps';
import InitialState from './initialState';

function componentWillReceiveProps(nextProps) {
  const { animationId, points } = this.props;

  if (nextProps.animationId !== animationId) {
    this.setState({ prevPoints: points });
  }
}

function handleAnimationEnd() {
  this.setState({ isAnimationFinished: true });
  this.props.onAnimationEnd();
}

function handleAnimationStart() {
  this.setState({ isAnimationFinished: false });
  this.props.onAnimationStart();
}

function renderDotsFn(fn) {
  // eslint-disable-next-line func-names
  return function () {
    const { isAnimationActive } = this.props;

    if (isAnimationActive && !this.state.isAnimationFinished) {
      return null;
    }

    return fn.call(this);
  };
}

function renderErrorBarFn(fn) {
  // eslint-disable-next-line func-names
  return function () {
    if (this.props.isAnimationActive && !this.state.isAnimationFinished) { return null; }

    return fn.call(this);
  };
}

export default function animationDecorator(component) {

  const { renderDots, renderErrorBar } = component.prototype;

  component.propTypes = {
    ...component.propTypes,
    ...PropTypes,
  };

  component.defaultProps = {
    ...component.defaultProps,
    ...DefaultProps,
  };

  component.prototype.state = {
    ...component.prototype.state.call(this),
    ...InitialState,
  };

  component.prototype.componentWillReceiveProps = componentWillReceiveProps;
  component.prototype.handleAnimationStart = handleAnimationStart;
  component.prototype.handleAnimationEnd = handleAnimationEnd;

  if (renderDots) {
    component.prototype.renderDots = renderDotsFn(renderDots);
  }

  if (renderErrorBar) {
    component.prototype.renderErrorBar = renderErrorBarFn(renderErrorBar);
  }

  console.log(component.prototype.state);
  console.log('yo man decorator', component.prototype.renderDots);
}
