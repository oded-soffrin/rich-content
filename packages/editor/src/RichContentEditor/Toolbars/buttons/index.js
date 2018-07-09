export const DesktopTextButtonList = [
  'Bold',
  'Italic',
  'Underline',
  'Title',
  'HeadingsDropDown',
  'Blockquote',
  'Separator',
  'Alignment',
  'OrderedList',
  'UnorderedList',
  // 'Indent',
  'Separator',
  'Link',
];

export const MobileTextButtonList = [
  'Bold',
  'Italic',
  'Underline',
  'Title',
  'Blockquote',
  'Link',
  'AddPlugin',
  'AlignLeft',
  'AlignCenter',
  'AlignRight',
  'AlignJustify',
  'OrderedList',
  'UnorderedList',
];

export { default as HeadingsDropDown } from './inline-styling/HeadingsDropDown';
export { default as TextAlignmentButton } from './TextAlignmentButton';
export { default as TextLinkButton } from './TextLinkButton';
export { default as AddPluginButton } from './AddPluginButton';
export {
  BoldButton,
  ItalicButton,
  UnderlineButton,
  IndentButton,
  TitleButton,
  BlockquoteButton,
  AlignTextLeftButton,
  AlignTextCenterButton,
  AlignTextRightButton,
  AlignTextJustifyButton,
  OrderedListButton,
  UnorderedListButton,
} from './TextButtons';
