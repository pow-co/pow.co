import React from "react";
import ThreeColumnLayout from "../components/ThreeColumnLayout";
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
  {
    title: <FormattedMessage id="faq16-title" />,
    tldr: <FormattedMessage id="faq16-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq17-title" />,
    tldr: <FormattedMessage id="faq17-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq18-title" />,
    tldr: <FormattedMessage id="faq18-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq19-title" />,
    tldr: <FormattedMessage id="faq19-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq20-title" />,
    tldr: <FormattedMessage id="faq20-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq21-title" />,
    tldr: <FormattedMessage id="faq21-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq22-title" />,
    tldr: <FormattedMessage id="faq22-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq23-title" />,
    tldr: <FormattedMessage id="faq23-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq24-title" />,
    tldr: <FormattedMessage id="faq24-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq25-title" />,
    tldr: <FormattedMessage id="faq25-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq26-title" />,
    tldr: <FormattedMessage id="faq26-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq27-title" />,
    tldr: <FormattedMessage id="faq27-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq28-title" />,
    tldr: <FormattedMessage id="faq28-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq29-title" />,
    tldr: <FormattedMessage id="faq29-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq30-title" />,
    tldr: <FormattedMessage id="faq30-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq31-title" />,
    tldr: <FormattedMessage id="faq31-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq32-title" />,
    tldr: <FormattedMessage id="faq32-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq33-title" />,
    tldr: <FormattedMessage id="faq33-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq34-title" />,
    tldr: <FormattedMessage id="faq34-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq35-title" />,
    tldr: <FormattedMessage id="faq35-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq36-title" />,
    tldr: <FormattedMessage id="faq36-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq37-title" />,
    tldr: <FormattedMessage id="faq37-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq38-title" />,
    tldr: <FormattedMessage id="faq38-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq39-title" />,
    tldr: <FormattedMessage id="faq39-tldr" />,
    content: ``,
  },
  {
    title: <FormattedMessage id="faq40-title" />,
    tldr: <FormattedMessage id="faq40-tldr" />,
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
