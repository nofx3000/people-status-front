import React from "react";
import { Collapse, Typography } from "antd";

const { Panel } = Collapse;
const { Title } = Typography;

const faqs = [
  {
    question: "心理咨询的流程是怎样的？",
    answer:
      "通常包括初次评估、制定治疗计划、定期咨询会谈、评估进展等步骤。具体流程会根据个人情况进行调整。",
  },
  {
    question: "心理咨询的费用是多少？",
    answer:
      "费用因专家资历和咨询方式而异，一般每次咨询费用在300-1000元之间。我们也提供一些优惠套餐。",
  },
  {
    question: "如何选择适合自己的心理咨询师？",
    answer:
      "可以考虑咨询师的专业背景、擅长领域、治疗方法等。我们建议可以先进行初次咨询，看是否与咨询师有良好的沟通和信任基础。",
  },
];

const FAQ: React.FC = () => {
  return (
    <>
      <Title level={2} style={{ margin: "0", marginBottom: "10px" }}>
        常见问题解答（FAQ）
      </Title>
      <Collapse accordion>
        {faqs.map((faq, index) => (
          <Panel header={faq.question} key={index}>
            <p>{faq.answer}</p>
          </Panel>
        ))}
      </Collapse>
    </>
  );
};

export default FAQ;
