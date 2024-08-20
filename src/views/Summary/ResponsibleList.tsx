import React, { useState, useRef, useEffect } from "react";
import style from "./summary.module.scss";
import { Button, Flex, message } from "antd";
import defaultAvatar from "../../images/avatar.jpeg";
import axios from "axios";
import ResponsibleModal from "./ResponsibleModal";

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
      const res = await axios.get(
        `http://localhost:3000/api/responsible/unit/${unit_id}`
      );
      setResponsibleList(res.data.data);
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
    <div className={style.flexcard} style={{ height: "70%", overflow: "auto" }}>
      <p
        style={{
          fontSize: "1.2vw",
          textAlign: "center",
          fontWeight: 800,
          lineHeight: "1vw",
        }}
      >
        骨干队伍
      </p>
      <Flex vertical justify="space-between" gap="middle">
        {responsibleList.map((responsible) => {
          return (
            <Flex vertical={false} flex={1} gap="middle" key={responsible.id}>
              <img
                src={
                  responsible.avatar
                    ? `http://localhost:3000/api/upload/avatar${responsible.avatar}`
                    : defaultAvatar
                }
                className={style.backboneAvatar}
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
    </div>
  );
};

export default ResponsibleList;
