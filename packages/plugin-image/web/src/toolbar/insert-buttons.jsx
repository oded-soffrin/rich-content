import { TOOLBARS } from 'wix-rich-content-editor-common';
import { getDefault } from '../consts';
import { InsertPluginIcon } from '../icons';

export default ({ helpers, t, settings }) => {
  const icon = settings?.toolbar?.icons?.Image || InsertPluginIcon;
  return [
    {
      type: 'file',
      name: 'Image',
      tooltipText: t('ImagePlugin_InsertButton_Tooltip'),
      toolbars: [TOOLBARS.FOOTER, TOOLBARS.SIDE],
      Icon: icon,
      componentData: getDefault(),
      helpers,
      t,
    },
  ];
};
