import React, { PureComponent } from 'react';
import { Context, mergeStyles } from 'wix-rich-content-common';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styles from '../../statics/styles/image-counter.scss';

class ImageCounter extends PureComponent {
  static propTypes = {
    formatLabel: PropTypes.func,
    children: PropTypes.node.isRequired,
    counter: PropTypes.number.isRequired,
    onPreviewExpand: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    imageSelector: PropTypes.func,
  };

  static defaultProps = {
    formatLabel: counter => `+ ${counter}`,
    onClick: () => {},
    imageSelector: images => (images && images.length > 0 ? [images[images.length - 1]] : []),
  };

  onClick = e => {
    const { onClick, onPreviewExpand } = this.props;
    e.preventDefault();
    onClick();
    onPreviewExpand();
  };

  renderDecoration = element => {
    const { formatLabel, counter } = this.props;
    const rect = element.getBoundingClientRect();
    const parentRect = this.container.getBoundingClientRect();
    const style = {
      width: rect.width,
      height: rect.height,
      top: rect.top - parentRect.top,
      left: rect.left - parentRect.left,
    };
    return (
      <div className={this.styles.imageCounter_container} style={style}>
        <span className={this.styles.imageCounter_label}>{formatLabel(counter)}</span>
      </div>
    );
  };

  decorateImages() {
    setTimeout(() => {
      if (this.wrapper) {
        const images = this.wrapper.querySelectorAll('[role=img]');
        const imagesToDecorate = this.props.imageSelector(images);
        const decorations = imagesToDecorate.map(img => this.renderDecoration(img));
        ReactDOM.render(decorations, this.container);
      }
    }, 500);
  }

  componentDidMount() {
    this.decorateImages();
  }

  handleWrapper = el => (this.wrapper = el);

  handleContainer = el => (this.container = el);

  render() {
    this.styles = this.styles || mergeStyles({ styles, theme: this.context.theme });
    /* eslint-disable */
    return (
      <div ref={this.handleWrapper} onClick={this.onClick}>
        <div ref={this.handleContainer} className={this.styles.imageCounter_overlay} />
        {this.props.children}
      </div>
    );
    /* eslint-enable */
  }
}

ImageCounter.contextType = Context.type;

export default ImageCounter;
