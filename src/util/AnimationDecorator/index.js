/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import React from 'react';
import Animate from 'react-smooth';
import PropTypes from './propTypes';
import DefaultProps from './defaultProps';
import InitialState from './initialState';

function componentWillReceiveProps(nextProps) {
  const { animationId, points, data, baseLine } = this.props;

  if (nextProps.animationId !== animationId) {
    if (points) this.setState({ prevPoints: points }); // Line Area Scatter Radar
    if (data) this.setState({ prevData: data }); // Bar RadialBar
    if (baseLine) this.setState({ prevBaseLine: baseLine }); // Area
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
  return function () {
    const { isAnimationActive } = this.props;
    const { isAnimationFinished } = this.state;
    if (isAnimationActive && !isAnimationFinished) return null;

    return fn.call(this);
  };
}

function renderErrorBarFn(fn) {
  return function () {
    const { isAnimationActive } = this.props;
    const { isAnimationFinished } = this.state;
    if (isAnimationActive && !isAnimationFinished) return null;

    return fn.call(this);
  };
}

function renderLabelListFn(fn) {
  return function () {
    const { isAnimationActive } = this.props;
    const { isAnimationFinished } = this.state;
    if (isAnimationActive && !isAnimationFinished) return null;

    return fn.call(this);
  };
}

function renderWithAnimation(fn, ...args) {
  const {
    isAnimationActive, animationBegin,
    animationDuration, animationEasing, animationId,
  } = this.props;

  return (
    <Animate
      begin={animationBegin}
      duration={animationDuration}
      isActive={isAnimationActive}
      easing={animationEasing}
      from={{ t: 0 }}
      to={{ t: 1 }}
      key={`line-${animationId}`} // check this constructor and assign the displayName
      onAnimationEnd={this.handleAnimationEnd.bind(this)}
      onAnimationStart={this.handleAnimationStart.bind(this)}
    >
      {
        props => fn.call(this, props, ...args)
      }
    </Animate>
  );
}
export default function animationDecorator(component) {

  const { renderDots, renderErrorBar, renderLabelList, state } = component.prototype;

  component.propTypes = {
    ...component.propTypes,
    ...PropTypes,
  };

  component.defaultProps = {
    ...component.defaultProps,
    ...DefaultProps,
  };

  component.prototype.state = Object.assign({},
    state && state.call(this),
    { ...InitialState },
  );

  component.prototype.componentWillReceiveProps = componentWillReceiveProps;
  component.prototype.handleAnimationStart = handleAnimationStart;
  component.prototype.handleAnimationEnd = handleAnimationEnd;
  component.prototype.renderWithAnimation = renderWithAnimation;

  if (renderDots) {
    component.prototype.renderDots = renderDotsFn(renderDots);
  }

  if (renderErrorBar) {
    component.prototype.renderErrorBar = renderErrorBarFn(renderErrorBar);
  }

  if (renderLabelList) {
    component.prototype.renderLabelList = renderLabelListFn(renderLabelList);
  }
}
