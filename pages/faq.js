import React from "react";
import { ThreeColumnLayout } from "../components";
import FAQItem from "../components/FAQItem";
import { FormattedMessage } from "react-intl";

const faqs = [
  {
    title: <FormattedMessage id="faq1-title" />,
    tldr: <FormattedMessage id="faq1-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq2-title" />,
    tldr: <FormattedMessage id="faq2-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq3-title" />,
    tldr: <FormattedMessage id="faq3-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq4-title" />,
    tldr: <FormattedMessage id="faq4-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq5-title" />,
    tldr: <FormattedMessage id="faq5-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq6-title" />,
    tldr: <FormattedMessage id="faq6-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq7-title" />,
    tldr: <FormattedMessage id="faq7-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq8-title" />,
    tldr: <FormattedMessage id="faq8-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq9-title" />,
    tldr: <FormattedMessage id="faq9-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq10-title" />,
    tldr: <FormattedMessage id="faq10-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq11-title" />,
    tldr: <FormattedMessage id="faq11-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq12-title" />,
    tldr: <FormattedMessage id="faq12-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq13-title" />,
    tldr: <FormattedMessage id="faq13-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq14-title" />,
    tldr: <FormattedMessage id="faq14-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq15-title" />,
    tldr: <FormattedMessage id="faq15-tldr" />,
    content: ``,
  },
];
const faq = () => {
  return (
    <ThreeColumnLayout>
      <div className="col-span-12 lg:col-span-6 min-h-screen pb-[200px] mt-10">
        {faqs.map((q, index) => (
          <FAQItem
            key={index}
            title={q.title}
            tldr={q.tldr}
            content={q.content}
          />
        ))}
      </div>
    </ThreeColumnLayout>
  );
};

export default faq;
