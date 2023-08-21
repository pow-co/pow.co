import React, { useMemo, useState } from 'react';

const Markdown = require('react-remarkable');

const RemarkableOptions = {
  breaks: true,
  html: true,
  linkify: true,
  linkTarget: '_blank',
  typographer: true,
  /* highlight: function (str: any, lang: any) {
      // ... your highlight logic ...
    } */
};

export const BFILE_REGEX = /b:\/\/([a-fA-F0-9]{64})/g;

interface ContentTextProps {
  content: string;
}

const ContentText = ({ content }: ContentTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const truncatedContent = useMemo(() => (content.length > 500 ? content.slice(0, 500) + '...' : content), [content]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <article
      onClick={(e: any) => e.stopPropagation()}
      className="prose break-words dark:prose-invert prose-a:text-primary-600 dark:prose-a:text-pirmary-400"
    >
      <Markdown
        options={RemarkableOptions}
        source={expanded ? content.replace(BFILE_REGEX, 'https://dogefiles.twetch.app/$1') : truncatedContent.replace(BFILE_REGEX, 'https://dogefiles.twetch.app/$1')}
      />
      {content.length > 500 && (
        <button onClick={toggleExpand} className="text-primary-600 cursor-pointer">
          {expanded ? 'See less' : 'See more'}
        </button>
      )}
    </article>
  );
};

export default ContentText;
