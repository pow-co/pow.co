import React, { useState } from 'react';
import { useRouter } from "next/router";

import axios from 'axios';

import 'react-markdown-editor-lite/lib/index.css';

import BSocial from 'bsocial';

import { toast } from 'react-hot-toast';

import { bsv } from 'scrypt-ts';
import { useBitcoin } from '../context/BitcoinContext';
import useWallet from '../hooks/useWallet';
import Drawer from './Drawer';
import WalletProviderPopUp from './WalletProviderPopUp';

interface CommentComposerProps {
  replyTx: string
}

const CommentComposer = ({ replyTx }: CommentComposerProps) => {
    const [content, setContent] = useState('');
    const [walletPopupOpen, setWalletPopupOpen] = useState(false);
    const { authenticated } = useBitcoin();
    const router = useRouter();
    const wallet = useWallet();

    const submitPost = async (e:any) => {
        e.preventDefault();

        if (!authenticated || !wallet) {
            setWalletPopupOpen(true);
            return;
        }

        const bsocial = new BSocial('pow.co');

        const post = bsocial.reply(replyTx);

        post.addMarkdown(content);

        const hexArrayOps = post.getOps('hex');

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

    const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    return (
        <div className="flex flex-col">
            <form onSubmit={submitPost}>
                <div className="flex flex-col">
                    <textarea
                      className="w-full appearance-none rounded-lg bg-primary-200 p-4 placeholder:opacity-90 placeholder:hover:text-white/80 focus:border-2 focus:border-primary-500 focus:outline-none dark:bg-primary-900"
                      placeholder="Write a comment..."
                      rows={4}
                      value={content}
                      onChange={handleChangeContent}
                    />
                    <div className="mt-4 flex justify-end">
                        <button type="submit" className="flex h-8 w-fit cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 p-5 text-center text-base font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1">Comment</button>
                    </div>
                </div>
            </form>
            <Drawer
              selector="#walletProviderPopupControler"
              isOpen={walletPopupOpen}
              onClose={() => setWalletPopupOpen(false)}
            >
                <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
            </Drawer>
        </div>
    );
};

export default CommentComposer;

export const MAP_PREFIX = `1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5`;
