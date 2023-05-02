import React, { useEffect } from 'react';
import { useRemirror } from '@remirror/react';
import {
  HardBreakExtension, LinkExtension, BoldExtension, PlaceholderExtension,
} from 'remirror/extensions';
import { SocialEditor } from './SocialEditor';

const ALL_USERS = [
  { id: 'joe', label: 'Joe' },
  { id: 'sue', label: 'Sue' },
  { id: 'pat', label: 'Pat' },
  { id: 'tom', label: 'Tom' },
  { id: 'jim', label: 'Jim' },
];

const TAGS = ['editor', 'remirror', 'opensource', 'prosemirror'];

const SAMPLE_DOC = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      attrs: { dir: null, ignoreBidiAutoUpdate: null },
      content: [],
    },
  ],
};

const RichInput: React.FC = () => {
  const { manager, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new PlaceholderExtension({ placeholder: 'What\'s the latest?' }),
      new LinkExtension({ autoLink: true }),
      new HardBreakExtension(),
    ],
    content: SAMPLE_DOC,
    selection: 'start',
    stringHandler: 'html',
  });

  useEffect(() => console.log(manager, state), []);

  return (
    <SocialEditor users={ALL_USERS} tags={TAGS} placeholder={'What\'s the latest?'} />
  );
};

export default RichInput;
