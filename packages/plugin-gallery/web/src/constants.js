export const getDefault = () => ({
  items: [],
  styles: {
    galleryLayout: 2,
    gallerySizeType: 'px',
    gallerySizePx: 300,
    galleryMargin: 0,
    oneRow: false,
    cubeRatio: 1,
    galleryThumbnailsAlignment: 'bottom',
    isVertical: false,
    numberOfImagesPerRow: 3,
    imageMargin: 20,
    thumbnailSpacings: 0,
    cubeType: 'fill',
    enableInfiniteScroll: true,
    titlePlacement: 'SHOW_ON_HOVER',
    allowHover: false,
    itemClick: 'link',
    fullscreen: false,
    showArrows: false,
    gridStyle: 1,
    loveButton: false,
    allowSocial: false,
    allowDownload: false,
    mobileSwipeAnimation: 'NO_EFFECT',
    thumbnailSize: 120,
    gotStyleParams: true,
  },
  config: {
    alignment: 'center',
    size: 'content',
    layout: 'small',
    spacing: 0,
  },
});

export const getTitleStyleParams = (galleryLayout, isMobile) => {
  const display = isMobile
    ? {
        titlePlacement: 'SHOW_BELOW',
        calculateTextBoxHeightMode: 'AUTOMATIC',
      }
    : {
        titlePlacement: 'SHOW_ON_HOVER',
        allowHover: true,
        galleryVerticalAlign: 'flex-end',
      };

  return {
    isVertical: galleryLayout === 1,
    allowTitle: true,
    galleryTextAlign: 'center',
    textsHorizontalPadding: 0,
    imageInfoType: 'NO_BACKGROUND',
    hoveringBehaviour: 'APPEARS',
    textsVerticalPadding: 0,
    ...display,
  };
};
