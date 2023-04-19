import React from 'react';

interface FAQItemProps {
  title: string;
  tldr: string;
  content: string;
}
function FAQItem({ title, tldr, content }: FAQItemProps) {
  return (
    <div className="mt-1 grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 first:sm:rounded-t-lg last:sm:rounded-b-lg hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20">
      <div className="mb- max-w-screen col-span-12 cursor-pointer p-4 text-gray-900 dark:text-white">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 font-light">{tldr}</p>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default FAQItem;
