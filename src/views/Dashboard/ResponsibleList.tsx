import React, { useState, useRef, useEffect } from "react";
import { Button, Flex, message } from "antd";
import defaultAvatar from "../../images/avatar.jpeg";
import ResponsibleModal from "./ResponsibleModal";
import { responsibleApi } from "../../api";
import { BASR_API_URL } from "../../constant";
interface responsibleModalRefInteface {
  setResponsibleDetail: (responsible: ResponsibleInter) => void;
  setIsResponsibleModalOpen: (isResponsibleModalOpen: boolean) => void;
}

interface ResposibleListInterface {
  currentUnitId: number;
}

const ResponsibleList: React.FC<ResposibleListInterface> = ({
  currentUnitId,
}) => {
  const responsibleModalRef = useRef<responsibleModalRefInteface>(null);

  const [responsibleList, setResponsibleList] = useState<ResponsibleInter[]>(
    []
  );

  useEffect(() => {
    fetchResponsibleByUnitId(currentUnitId);
  }, [currentUnitId]);

  const fetchResponsibleByUnitId = async (unit_id: number) => {
    try {
      const res = await responsibleApi.getResponsibleByUnit(unit_id);
      if (res.status === 200) {
        setResponsibleList(res.data.data);
      }
    } catch (err) {
      message.error("获取数据失败");
    }
  };

  const openResponsibleModal = (responsible: ResponsibleInter) => {
    if (responsibleModalRef.current) {
      responsibleModalRef.current.setResponsibleDetail(responsible);
      responsibleModalRef.current.setIsResponsibleModalOpen(true);
    }
  };
  return (
    <>
      <Flex vertical justify="space-between" gap="middle">
        {responsibleList.map((responsible) => {
          return (
            <Flex vertical={false} flex={1} gap="middle" key={responsible.id}>
              <img
                src={
                  responsible.avatar
                    ? `${BASR_API_URL}/upload/avatar${responsible.avatar}`
                    : defaultAvatar
                }
                style={{
                  width: "10vh",
                  height: "10vh",
                  borderRadius: "50%",
                  marginRight: "1vw"
                }}
              ></img>
              <div>
                <p>姓名：{responsible.name}</p>
                <p>特点：{responsible.description}</p>
                <Button
                  onClick={() => {
                    openResponsibleModal(responsible);
                  }}
                >
                  查看帮带对象
                </Button>
              </div>
            </Flex>
          );
        })}
      </Flex>
      <ResponsibleModal ref={responsibleModalRef} />
    </>
  );
};

export default ResponsibleList;
