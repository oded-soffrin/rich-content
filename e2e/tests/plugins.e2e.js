import {
  PLUGIN_COMPONENT,
  PLUGIN_TOOLBAR_BUTTONS,
  DIVIDER_DROPDOWN_OPTIONS,
  GALLERY_SETTINGS,
  GALLERY_IMAGE_SETTINGS,
  IMAGE_SETTINGS,
} from '../cypress/dataHooks';
import { DEFAULT_DESKTOP_BROWSERS } from '../tests/constants';

const eyesOpen = ({
  test: {
    parent: { title },
  },
}) =>
  cy.eyesOpen({
    appName: 'Plugins',
    testName: title,
    browser: DEFAULT_DESKTOP_BROWSERS,
  });

describe('plugins', () => {
  beforeEach(function() {
    cy.switchToDesktop();
  });

  afterEach(() => cy.matchContentSnapshot());

  context('image', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () => cy.loadEditorAndViewer('images'));

    after(() => cy.eyesClose());

    it('render plugin toolbar and customize in settings', function() {
      cy.openPluginToolbar(PLUGIN_COMPONENT.IMAGE)
        .shrinkPlugin()
        .hideTooltip();
      cy.eyesCheckWindow(this.test.title);
      cy.openImageSettings();
      cy.get(`[data-hook=${IMAGE_SETTINGS.PREVIEW}]:first`);
      cy.eyesCheckWindow(this.test.title);
      cy.addImageTitle();
      cy.eyesCheckWindow(this.test.title);
      cy.openImageSettings(false).deleteImageTitle();
      cy.eyesCheckWindow(this.test.title);
      cy.openImageSettings(false).addImageLink();
      cy.hideTooltip();
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('gallery', () => {
    before(function() {
      eyesOpen(this);
    });

    after(() => cy.eyesClose());

    it('should render gallery plugin toolbar and settings', function() {
      cy.loadEditorAndViewer('gallery')
        .get(`[data-hook=${'image-item'}]:first`)
        .get(`[data-hook=${'image-item'}]`)
        .eq(1);
      cy.openPluginToolbar(PLUGIN_COMPONENT.GALLERY)
        .shrinkPlugin()
        .hideTooltip();
      cy.eyesCheckWindow(this.test.title);
      cy.openGalleryAdvancedSettings()
        .get('.__react_component_tooltip.show')
        .should('not.exist');
      cy.eyesCheckWindow(this.test.title);
    });

    context('organize media', () => {
      it('should allow to manipulate the media items', function() {
        const firstImage = `[data-hook=${GALLERY_SETTINGS.IMAGE}]:first`;
        const anyImage = `[data-hook=${GALLERY_SETTINGS.IMAGE}]`;
        cy.loadEditorAndViewer('gallery')
          .openPluginToolbar(PLUGIN_COMPONENT.GALLERY)
          .shrinkPlugin()
          .get(`[data-hook=${'image-item'}]:first`)
          .get(`[data-hook=${'image-item'}]`)
          .eq(1)
          .openGalleryAdvancedSettings()
          .openGallerySettings()
          .get(firstImage)
          .get(anyImage)
          .eq(1);
        cy.eyesCheckWindow(this.test.parent.title + ' - ' + this.test.title);
        cy.get(firstImage).click();
        cy.get(`[data-hook=${GALLERY_SETTINGS.DELETE}]`);
        cy.eyesCheckWindow(this.test.parent.title + ' - ' + this.test.title);
        cy.get(`[data-hook=${GALLERY_SETTINGS.SELECT_ALL}]`).click();
        cy.eyesCheckWindow(this.test.parent.title + ' - ' + this.test.title);
        cy.get(`[data-hook=${GALLERY_SETTINGS.DESELECT}]`).click();
        cy.dragAndDrop(firstImage, anyImage, 1);
        cy.eyesCheckWindow(this.test.parent.title + ' - ' + this.test.title);
        cy.get(firstImage).click();
        cy.get(`[data-hook=${GALLERY_SETTINGS.DELETE}]`).click();
        cy.get(firstImage);
        cy.eyesCheckWindow(this.test.parent.title + ' - ' + this.test.title);
        cy.get(`[data-hook=${GALLERY_SETTINGS.SELECT_ALL}]`).click();
        cy.get(`[data-hook=${GALLERY_SETTINGS.DELETE}]`).click();
        cy.eyesCheckWindow(this.test.parent.title + ' - ' + this.test.title);
      });
    });

    context('image settings', () => {
      it('should allow to update image content', function() {
        cy.loadEditorAndViewer('gallery')
          .openPluginToolbar(PLUGIN_COMPONENT.GALLERY)
          .shrinkPlugin()
          .get(`[data-hook=${'image-item'}]:first`)
          .get(`[data-hook=${'image-item'}]`)
          .eq(1)
          .openGalleryAdvancedSettings()
          .openGallerySettings()
          .openGalleryImageSettings()
          .get(`[data-hook=${GALLERY_IMAGE_SETTINGS.PREVIEW}]:first`);
        cy.eyesCheckWindow(this.test.parent.title + ' - ' + this.test.title);
        cy.get(`[data-hook=${GALLERY_IMAGE_SETTINGS.DELETE}]`).click({ force: true });
        cy.get(`[data-hook=${GALLERY_IMAGE_SETTINGS.PREVIEW}]:first`);
        cy.eyesCheckWindow(this.test.parent.title + ' - ' + this.test.title);
        cy.get(`[data-hook=${GALLERY_IMAGE_SETTINGS.DELETE}]`).click({ force: true });
        cy.get(`[data-hook=${GALLERY_SETTINGS.UPLOAD}]`);
        cy.eyesCheckWindow(this.test.parent.title + ' - ' + this.test.title);
      });
      // TODO: title and link image tests
      // // eslint-disable-next-line mocha/no-skipped-tests
      // it.skip('allow to add a title', function() {
      //   cy.addGalleryImageTitle().checkTitle();
      //   cy.eyesCheckWindow(this.test.parent.title + ' - ' + this.test.title);
      // });
    });
  });

  context('video', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () => cy.loadEditorAndViewer('empty'));

    after(() => cy.eyesClose());

    it('render upload modal', function() {
      cy.openVideoUploadModal();
      cy.eyesCheckWindow(this.test.title);
    });

    it('enable to add a video from URI', function() {
      cy.openVideoUploadModal().addVideoFromURI();
      cy.shrinkPlugin();
      cy.waitForVideoToLoad();
      cy.focusEditor().enterParagraphs(['Will this fix the flakiness?']);
      cy.eyesCheckWindow(this.test.title);
    });

    // TODO: remove skip once custom mock upload is stablized
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('enable to add a custom video', function() {
      cy.openVideoUploadModal().addCustomVideo();
      cy.waitForVideoToLoad();
      cy.shrinkPlugin();
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('soundcloud', () => {
    before(function() {
      eyesOpen(this);
    });

    beforeEach('load editor', () => cy.loadEditorAndViewer('empty'));

    after(() => cy.eyesClose());

    it('render upload modal', function() {
      cy.openSoundCloudModal();
      cy.eyesCheckWindow(this.test.title);
    });

    it('enable to add a soundcloud URI', function() {
      cy.openSoundCloudModal().addSoundCloud();
      cy.waitForVideoToLoad();
      cy.shrinkPlugin();
      cy.focusEditor().enterParagraphs(['Will this fix the flakiness?']);
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('html', () => {
    before(function() {
      eyesOpen(this);
    });

    after(() => cy.eyesClose());

    it('render html plugin toolbar', function() {
      cy.loadEditorAndViewer('empty').addHtml();
      cy.get(`[data-hook*=${PLUGIN_TOOLBAR_BUTTONS.EDIT}]`)
        .click({ multiple: true })
        .click();
      cy.hideTooltip();
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('divider', () => {
    before(function() {
      eyesOpen(this);
    });

    after(() => cy.eyesClose());

    it('render plugin toolbar and change styling', function() {
      cy.loadEditorAndViewer('divider')
        .openPluginToolbar(PLUGIN_COMPONENT.DIVIDER)
        .openDropdownMenu();
      cy.eyesCheckWindow('render divider plugin toolbar');

      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.SMALL);
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.ALIGN_LEFT);

      cy.get('.editor [data-hook=divider-double]')
        .parent()
        .click();
      cy.get('[data-hook*="PluginToolbar"]:first');

      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.MEDIUM);
      cy.clickToolbarButton(PLUGIN_TOOLBAR_BUTTONS.ALIGN_RIGHT);

      cy.get('.editor [data-hook=divider-dashed]')
        .parent()
        .click();
      cy.get('[data-hook*="PluginToolbar"]:first').openDropdownMenu(
        `[data-hook=${DIVIDER_DROPDOWN_OPTIONS.DOUBLE}]`
      );
      cy.eyesCheckWindow('change divider styling');
    });
  });

  context('gif', () => {
    before('load editor', function() {
      eyesOpen(this);
      cy.loadEditorAndViewer('gif');
    });

    after(() => cy.eyesClose());

    it('render giphy plugin toolbar', function() {
      cy.openPluginToolbar(PLUGIN_COMPONENT.GIF).clickToolbarButton(
        PLUGIN_TOOLBAR_BUTTONS.SMALL_CENTER
      );
      cy.get(`button[data-hook=${PLUGIN_TOOLBAR_BUTTONS.REPLACE}][tabindex=0]`).click();
      cy.get('.__react_component_tooltip.show').should('not.exist');
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('map', () => {
    before('load editor', function() {
      eyesOpen(this);
      cy.loadEditorAndViewer('map');
    });

    after(() => cy.eyesClose());

    it('render map plugin toolbar and settings', function() {
      cy.openPluginToolbar(PLUGIN_COMPONENT.MAP);
      cy.eyesCheckWindow('render map plugin toolbar');
      cy.openMapSettings();
      cy.get('.gm-style-cc');
      cy.eyesCheckWindow('render map settings');
    });
  });

  context('file-upload', () => {
    before('load editor', function() {
      eyesOpen(this);
      cy.loadEditorAndViewer('file-upload');
    });

    after(() => cy.eyesClose());

    it('render file-upload plugin toolbar', function() {
      cy.openPluginToolbar(PLUGIN_COMPONENT.FILE_UPLOAD);
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('drag and drop', () => {
    before('load editor', function() {
      eyesOpen(this);
      cy.loadEditorAndViewer('dragAndDrop');
    });

    after(() => cy.eyesClose());

    it('drag and drop plugins', function() {
      cy.focusEditor();
      const src = `[data-hook=${PLUGIN_COMPONENT.IMAGE}] + [data-hook=componentOverlay]`;
      const dest = `span[data-offset-key="fjkhf-0-0"]`;
      cy.dragAndDropPlugin(src, dest);
      cy.get('img[style="opacity: 1;"]');
      cy.eyesCheckWindow(this.test.title);
    });
  });

  context('alignment', () => {
    before(function() {
      eyesOpen(this);
    });

    after(() => cy.eyesClose());

    function testAtomicBlockAlignment(align) {
      it('align atomic block ' + align, function() {
        cy.loadEditorAndViewer('images')
          .alignImage(align)
          .hideTooltip();
        cy.eyesCheckWindow(this.test.title);
      });
    }

    testAtomicBlockAlignment('left');
    testAtomicBlockAlignment('center');
    testAtomicBlockAlignment('right');
  });
});
