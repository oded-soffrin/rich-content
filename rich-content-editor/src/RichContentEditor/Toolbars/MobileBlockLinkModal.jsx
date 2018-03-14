import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import MobileLinkModal from './MobileLinkModal';


export default class MobileBlockLinkModal extends Component {
  hidePopup = () => this.props.hidePopup();

  wrapBlockInLink = ({ url, targetBlank, nofollow }) => {
    const { pubsub } = this.props;
    if (!isEmpty(url)) {
      pubsub.set('componentLink', { url, targetBlank, nofollow });
    } else {
      pubsub.set('componentLink', null);
    }
    this.hidePopup();
  };

  deleteLink = () => {
    this.props.pubsub.set('componentLink', null);
  }

  render() {
    const { pubsub, theme, isMobile, t } = this.props;
    const componentLink = pubsub.get('componentLink');
    const { url, targetBlank, nofollow } = componentLink || {};
    return (
      <MobileLinkModal
        url={url}
        targetBlank={targetBlank}
        nofollow={nofollow}
        theme={theme}
        isActive={!!componentLink}
        isMobile={isMobile}
        onDone={this.wrapBlockInLink}
        onCancel={this.hidePopup}
        onDelete={this.deleteLink}
        t={t}
      />
    );
  }
}

MobileBlockLinkModal.propTypes = {
  pubsub: PropTypes.object.isRequired,
  hidePopup: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  url: PropTypes.string,
  isMobile: PropTypes.bool,
  targetBlank: PropTypes.bool,
  nofollow: PropTypes.bool,
  t: PropTypes.func,
};
