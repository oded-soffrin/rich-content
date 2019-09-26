import React from 'react';
import PropTypes from 'prop-types';
import { isEqual, get } from 'lodash';
import { validate, mergeStyles, Context } from 'wix-rich-content-common';
import { convertItemData } from './helpers/convert-item-data';
import { getDefault, getTitleStyleParams } from './constants';
import resizeMediaUrl from './helpers/resize-media-url';
import schema from '../statics/data-schema.json';
import viewerStyles from '../statics/styles/viewer.scss';
import 'pro-gallery/dist/statics/main.min.css';

const { ProGallery } = process.env.SANTA ? {} : require('pro-gallery');

class GalleryViewer extends React.Component {
  constructor(props) {
    validate(props.componentData, schema);
    super(props);

    this.state = this.stateFromProps(props);

    this.sampleItems = [1, 2, 3].map(i => {
      return {
        metadata: {
          height: 10,
          width: 10,
        },
        orderIndex: i,
        itemId: 'sampleItem-' + i,
        url:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAA1JREFUCB1jePv27X8ACVkDxyMHIvwAAAAASUVORK5CYII=', //eslint-disable-line
      };
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.componentData, this.props.componentData)) {
      validate(nextProps.componentData, schema);
    }
    this.setState(this.stateFromProps(nextProps), () => this.updateDimensions());
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    if (this.container && this.container.getBoundingClientRect) {
      const width = Math.floor(this.container.getBoundingClientRect().width);
      this.setState({ size: { width } });
    }
  };

  stateFromProps = props => {
    const { componentData } = props;
    const defaults = getDefault();
    const items = componentData.items || defaults.items;
    const styleParams = this.generateStyleParams(componentData, items);
    // TODO remove gallery key
    const galleryKey = Math.random();
    return {
      galleryKey,
      items,
      styleParams,
    };
  };

  generateStyleParams = (componentData, items) => {
    const defaults = getDefault();

    const styleParams = {
      ...defaults.styles,
      ...(componentData.styles || {}),
    };

    const titleStyleParams = this.hasTitle(items)
      ? getTitleStyleParams(styleParams.galleryLayout, this.context.isMobile)
      : {};

    const isRTL = get(this.context, 'languageDir') === 'rtl';

    return {
      ...styleParams,
      ...titleStyleParams,
      isRTL,
    };
  };

  // handle pro-gallery events
  // https://github.com/wix-incubator/pro-gallery/blob/master/packages/gallery/src/utils/constants/events.js
  handleGalleryEvents = (name, data) => {
    switch (name) {
      // container size change callback
      case 'GALLERY_CHANGE':
        this.container && (this.container.style.height = `${data.layoutHeight}px`);
        this.setState(prevState => ({
          size: {
            ...prevState.size,
            height: data.layoutHeight,
          },
        }));
        break;
      default:
        break;
    }
  };

  hasTitle = items => items.some(item => item.metadata && item.metadata.title);

  get items() {
    const { items } = this.state;
    const { anchorTarget, relValue } = this.context;

    if (items.length > 0) {
      return convertItemData({ items, anchorTarget, relValue });
    } else {
      return this.sampleItems;
    }
  }

  render() {
    this.styles = this.styles || mergeStyles({ styles: viewerStyles, theme: this.context.theme });
    // TODO remove gallery key
    const { galleryKey, styleParams, size = { width: 300 } } = this.state;
    return (
      <div ref={elem => (this.container = elem)} className={this.styles.gallery_container}>
        <ProGallery
          // TODO remove gallery key
          key={galleryKey}
          items={this.items}
          styles={styleParams}
          container={size}
          settings={this.props.settings}
          eventsListener={this.handleGalleryEvents}
          resizeMediaUrl={resizeMediaUrl}
        />
      </div>
    );
  }
}

GalleryViewer.propTypes = {
  componentData: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  settings: PropTypes.object,
};

GalleryViewer.contextType = Context.type;

export default GalleryViewer;
