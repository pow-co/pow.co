import {
  FC, PropsWithChildren, useCallback, useMemo, useState,
} from 'react';
import type { CreateEditorStateProps, IdentifierSchemaAttributes } from 'remirror';
import {
  useRemirror, RemirrorProps, MentionAtomState, MentionAtomPopupComponent, ThemeProvider as RemirrorThemeProvider, Remirror, EditorComponent, useHelpers,
} from '@remirror/react';
import {
  MentionAtomExtension, MarkdownExtension, MentionAtomNodeAttributes, PlaceholderExtension, wysiwygPreset, TableExtension, LinkExtension,
} from 'remirror/extensions';
import axios from 'axios';
import { AllStyledComponent } from '@remirror/styles/emotion';
import BSocial from 'bsocial';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Tooltip } from 'react-tooltip';
import { bsv } from 'scrypt-ts';
import { useTuning } from '../context/TuningContext';
import { useBitcoin } from '../context/BitcoinContext';
import useWallet from '../hooks/useWallet';
import Drawer from './Drawer';
import WalletProviderPopUp from './WalletProviderPopUp';

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
  Pick<MentionComponentProps, 'users' | 'tags'> {
    inReplyTo?: string;
    defaultTag?: string;
  }

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
  inReplyTo,
  defaultTag,
  ...rest
}) => {
  const [walletPopupOpen, setWalletPopupOpen] = useState(false);
  const { paymail, authenticated } = useBitcoin();
  const { signPosts } = useTuning();
  const [signWithPaymail, setSignWithPaymail] = useState(signPosts);
  const [images, setImages] = useState<any>([]);
  const router = useRouter();

  const wallet = useWallet();
  
  const extensions = useCallback(
    () => [
      new PlaceholderExtension({ placeholder }),
      new MentionAtomExtension({
        matchers: [
          { name: 'at', char: '@' },
          { name: 'tag', char: '#' },
        ],
      }),
      new MarkdownExtension(),
      new TableExtension(),
      new LinkExtension({ 
        autoLink: true,
        
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
      toast.error('Please select up to 4 images.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast.error('Please select only image files.');
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
  };

  const thumbs = images.map((img: any, index: number) => (
    <div key={`thumb-${index}`} draggable id={index.toString()} className="relative">
      <div className="relative h-full w-full cursor-pointer rounded-xl bg-cover bg-center" style={{ backgroundImage: `url("${img}")` }}>
        <div onClick={() => handleDelete(index)} className="z-6 absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </div>
  ));

  const submitPost = async (textContent: string) => {
    if (!authenticated || !wallet) {
      setWalletPopupOpen(true);
      return;
    }

    const bsocial = new BSocial('pow.co');

    let post: any;

    if (inReplyTo) {
      post = bsocial.reply(inReplyTo);
      post.setType('reply');
    } else {
      post = bsocial.post();
    }

    if (textContent) {
      post.addMarkdown(textContent);
    }
    
    if (images.length > 0) {
      images.forEach((file: any) => {
        post.addImage(file);
      });
    }

    if (signWithPaymail) {
      post.addMapData('paymail', paymail);
    }

    if (defaultTag) {
      post.addMapData('channel', defaultTag);
    }

    const hexArrayOps = post.getOps('hex');
    const opReturn = hexArrayOps.map((op: any) => `0x${op}`);
    console.log({ hexArrayOps, opReturn });

    toast('Publishing Your Post to the Network', {
      icon: '⛏️',
      style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
      },
    });

    const output = new bsv.Transaction.Output({
      script: bsv.Script.fromASM(`OP_0 OP_RETURN ${hexArrayOps.join(' ')}`),
      satoshis: wallet.name === 'handcash' ? 10 : 1,
    });

    try {

      const tx = await wallet.createTransaction({ outputs: [output] });

      toast('Success!', {
        icon: '✅',
        style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        },
      });

      axios.post('https://b.map.sv/ingest', {
          rawTx: tx.toString(),
      })
      .then((result) => {
        console.debug('b.map.sv.ingest.result', result.data);
      })
      .catch((error) => {
        console.error('post.submit.b.map.sv.ingest.error', error);
      });

      axios.post('https://www.pow.co/api/v1/posts', {
          transactions: [{
            tx: tx.toString(),
          }],
      })
      .then((result) => {
        console.debug('powco.posts.ingest.result', result.data);
      })
      .catch((error) => {
        console.error('post.submit.powco.error', error);
      });

      router.push(`/${tx.hash}`);

    } catch (error) {

      toast('Error!', {
        icon: '🐛',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });

    }
  };

  const SubmitButton = () => {
    const { getMarkdown } = useHelpers();
    const handleClick = useCallback(() => submitPost(getMarkdown()), [getMarkdown]);
    return (
      <button type="button" onClick={handleClick} className="flex cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-primary-400 to-primary-500 px-5 py-2 text-center text-sm font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1">
        Post $0.00
      </button>
    );
  };

  return (
    <>
    <AllStyledComponent className="bg-primary-100 p-4 dark:bg-primary-700/20 sm:rounded-xl">
      <RemirrorThemeProvider theme={{
        color: {
          outline: 'none',
          border: 'none',
          text: 'none',
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
          6: 'none',
        },
      }}
      >
        <Remirror manager={manager} classNames={['p-4 prose dark:prose-invert text-gray-900 dark:text-white bg-transparent shadow-none placeholder:not-italic']} {...rest}>
          <EditorComponent />
          {images.length > 0 && (
<div className="grid-gap-0.5 mt-4 grid gap-0.5 overflow-hidden" style={{ height: "319.5px", gridTemplateColumns: `repeat(${images.length > 1 ? "2" : "1"}, 1fr)` }}>
            {thumbs}
</div>
)}
          <div className="mt-5 flex w-full items-center">
            <div onClick={() => document.getElementById('file-input')?.click()} className="">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 cursor-pointer stroke-gray-600 dark:stroke-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            {defaultTag && <div className="ml-5 rounded-full bg-primary-500 px-3 py-1 text-white">#{defaultTag}</div>}
            <div className="grow" />
            <div id="sign-option" onClick={() => setSignWithPaymail(!signWithPaymail)} className="mr-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-6 w-6 ${signWithPaymail ? "stroke-primary-500" : "stroke-gray-600 dark:stroke-gray-400"}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <Tooltip 
                anchorSelect="#sign-option"
                style={{ width: 'fit-content', borderRadius: '10px' }}
                place="left"
                className="italic text-white dark:bg-gray-100 dark:text-black"
              >
                Sign with paymail?
              </Tooltip>
            </div>
            <div className="">
              <SubmitButton />
            </div>
          </div>
          <MentionComponent users={users} tags={tags} />
          {children}
          
        </Remirror>
      </RemirrorThemeProvider>
    </AllStyledComponent>
    <Drawer
      selector="#walletProviderPopupControler"
      isOpen={walletPopupOpen}
      onClose={() => setWalletPopupOpen(false)}
    >
        <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
    </Drawer>
    </>
  );
};
