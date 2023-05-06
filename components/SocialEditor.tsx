import {
  FC, PropsWithChildren, useCallback, useMemo, useState,
} from 'react';
import type { CreateEditorStateProps, IdentifierSchemaAttributes } from 'remirror';
import {
  useRemirror, RemirrorProps, MentionAtomState, MentionAtomPopupComponent, ThemeProvider as RemirrorThemeProvider, Remirror, EditorComponent, Toolbar, DataTransferButtonGroup, HeadingLevelButtonGroup, BasicFormattingButtonGroup, ListButtonGroup, HistoryButtonGroup, useRemirrorContext,
} from '@remirror/react';
import {
  MentionAtomExtension, MentionAtomNodeAttributes, PlaceholderExtension, wysiwygPreset, TableExtension, LinkExtension,
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
  const [images, setImages] = useState<any>([])
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
      new LinkExtension({ 
        autoLink: true
        
      }),
      ...wysiwygPreset(),
    ],
    [placeholder],
  );

  const { manager } = useRemirror({ extensions, extraAttributes, stringHandler });

  const handleFileInputChange = (e: any) => {
    const files: any[] = Array.from(e.target.files);
    const imageUrls: any[] = [];

    // Limit the number of files to 4
    if (files.length > 4) {
      alert('Please select up to 4 images.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event: any) => {
        imageUrls.push(event.target.result);
        if (imageUrls.length === files.length) {
          setImages((prevImages: any) => prevImages.concat(imageUrls));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (index: number) => {
    const newImages = images.filter((_: any, i: any) => i !== index);
    setImages(newImages);
  }

  const thumbs = images.map((img: any, index: number) => (
    <div draggable={true} id={index.toString()} className='relative'>
      <div className='w-full h-full bg-cover bg-center rounded-xl relative cursor-pointer' style={{backgroundImage:`url("${img}")`}}>
        <div onClick={() => handleDelete(index)} className='absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-opacity-50 bg-white flex items-center justify-center z-6'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </div>
  ));

  return (
    <AllStyledComponent className="p-4 sm:rounded-xl bg-primary-100 dark:bg-primary-700/20">
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
        space: {
          1: 'none',
          2: 'none',
          3: 'none',
          4: 'none',
          5: 'none',
          6: 'none'
        }
      }}
      >
        <Remirror manager={manager}  classNames={['-p-4 prose dark:prose-invert text-gray-900 dark:text-white bg-transparent shadow-none placeholder:not-italic']} {...rest}>
          <EditorComponent />
          {images.length > 0 && <div className='grid grid-gap-0.5 gap-0.5 mt-4 overflow-hidden' style={{ height: "319.5px", gridTemplateColumns: `repeat(${images.length > 1 ? "2": "1"}, 1fr)`}}>
            {thumbs}
          </div>}
          <div className='flex w-full items-center mt-5'>
            <div onClick={()=>document.getElementById('file-input')?.click()} className=''>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 stroke-gray-600 dark:stroke-gray-400 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className='hidden'
            />
            <div className='grow'/>
            <div className=''>
              <button className='flex text-sm leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-400 to-blue-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'>
                Post $0.00
              </button>
            </div>
          </div>
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


