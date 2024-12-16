import { useState, useImperativeHandle, forwardRef } from "react";
import { Modal, Flex } from "antd";
import defaultAvatar from "../../images/avatar.jpeg";
import formatCatagory from "../../utils/FormatCatagory";
import { BASR_API_URL } from "../../constant";

const ResponsibleModal = forwardRef((props, ref) => {
  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
  const [responsibleDetail, setResponsibleDetail] = useState<ResponsibleInter>(
    {}
  );

  useImperativeHandle(ref, () => ({
    setResponsibleDetail: (responsible: ResponsibleInter) => {
      setResponsibleDetail(responsible);
    },
    setIsResponsibleModalOpen: (isResponsibleModalOpen: boolean) => {
      setIsResponsibleModalOpen(isResponsibleModalOpen);
    },
  }));

  return (
    <Modal
      title="帮带对象"
      open={isResponsibleModalOpen}
      onOk={() => {
        setIsResponsibleModalOpen(false);
      }}
      onCancel={() => {
        setIsResponsibleModalOpen(false);
      }}
    >
      <Flex vertical>
        {responsibleDetail.people?.map((person) => (
          <Flex key={person.id}>
            <div style={{ marginRight: "2vw" }}>
              <img
                src={
                  person.avatar
                    ? `${BASR_API_URL}/upload/avatar${person.avatar}`
                    : defaultAvatar
                }
                alt="Avatar"
                style={{ width: "8vw", height: "15vh" }}
              ></img>
            </div>
            <div>
              <p>姓名:{person.name}</p>
              <p>类别:{formatCatagory(person.catagory as number)}</p>
              <p>婚姻状况：{person.married ? "是" : "否"}</p>
            </div>
          </Flex>
        ))}
      </Flex>
    </Modal>
  );
});

export default ResponsibleModal;
