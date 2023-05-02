import {
  FC, PropsWithChildren, useCallback, useMemo, useState,
} from 'react';
import type { CreateEditorStateProps, IdentifierSchemaAttributes } from 'remirror';
import {
  useRemirror, RemirrorProps, MentionAtomState, MentionAtomPopupComponent, ThemeProvider as RemirrorThemeProvider, Remirror, EditorComponent, Toolbar, DataTransferButtonGroup, HeadingLevelButtonGroup, BasicFormattingButtonGroup, ListButtonGroup, HistoryButtonGroup,
} from '@remirror/react';
import {
  MentionAtomExtension, MentionAtomNodeAttributes, PlaceholderExtension, wysiwygPreset, TableExtension,
} from 'remirror/extensions';
import { AllStyledComponent } from '@remirror/styles/emotion';

const extraAttributes: IdentifierSchemaAttributes[] = [
  { identifiers: ['mention', 'emoji'], attributes: { role: { default: 'presentation' } } },
  { identifiers: ['mention'], attributes: { href: { default: null } } },
];

export interface ReactEditorProps
  extends Pick<CreateEditorStateProps, 'stringHandler'>,
  Pick<RemirrorProps, 'initialContent' | 'editable' | 'autoFocus' | 'hooks'> {
  placeholder?: string;
}

export interface SocialEditorProps
  extends Partial<ReactEditorProps>,
  Pick<MentionComponentProps, 'users' | 'tags'> {}

interface MentionComponentProps<
UserData extends MentionAtomNodeAttributes = MentionAtomNodeAttributes,
> {
  users?: UserData[];
  tags?: string[];
}

function MentionComponent({ users, tags }: MentionComponentProps) {
  const [mentionState, setMentionState] = useState<MentionAtomState | null>();
  const tagItems = useMemo(
    () => (tags ?? []).map((tag) => ({ id: tag, label: `#${tag}` })),
    [tags],
  );
  const items = useMemo(() => {
    if (!mentionState) {
      return [];
    }

    const allItems = mentionState.name === 'at' ? users : tagItems;

    if (!allItems) {
      return [];
    }

    const query = mentionState.query.full.toLowerCase() ?? '';
    return allItems.filter((item) => item.label.toLowerCase().includes(query)).sort();
  }, [mentionState, users, tagItems]);

  return <MentionAtomPopupComponent onChange={setMentionState} items={items} />;
}

export const SocialEditor: FC<PropsWithChildren<SocialEditorProps>> = ({
  placeholder,
  stringHandler,
  children,
  users,
  tags,
  ...rest
}) => {
  const extensions = useCallback(
    () => [
      new PlaceholderExtension({ placeholder }),
      new MentionAtomExtension({
        matchers: [
          { name: 'at', char: '@' },
          { name: 'tag', char: '#' },
        ],
      }),
      new TableExtension(),
      ...wysiwygPreset(),
    ],
    [placeholder],
  );

  const { manager } = useRemirror({ extensions, extraAttributes, stringHandler });

  return (
    <AllStyledComponent className="rounded-xl bg-primary-100 dark:bg-primary-700/20">
      <RemirrorThemeProvider theme={{
        color: {
          outline: 'none',
          border: 'none',
        },
        boxShadow: {
          1: 'none',
          2: 'none',
          3: 'none',
        },
      }}
      >
        <Remirror manager={manager} classNames={['prose dark:prose-invert text-gray-900 dark:text-white bg-transparent shadow-none placeholder:not-italic']} {...rest}>
          <EditorComponent />
          <EditorToolbar />
          <MentionComponent users={users} tags={tags} />
          {children}
        </Remirror>
      </RemirrorThemeProvider>
    </AllStyledComponent>
  );
};

const EditorToolbar : FC = () => (
  <Toolbar className="flex flex-wrap justify-around overflow-hidden bg-transparent pt-3" style={{ backgroundColor: 'transparent' }}>
    <div className="flex sm:hidden">
      <HistoryButtonGroup />
      <DataTransferButtonGroup />
    </div>
    <HeadingLevelButtonGroup />
    <BasicFormattingButtonGroup />
    <ListButtonGroup />
  </Toolbar>
);
