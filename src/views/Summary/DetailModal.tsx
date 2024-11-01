import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { Modal, Flex } from "antd";
import dateformat from "dateformat";
import { CaretRightOutlined } from "@ant-design/icons";
import getRecordLevel from "../../utils/GetRecordLevel";
import { personApi } from "../../api";
import defaultAvatar from "../../images/avatar.jpeg";

const DetailModal = forwardRef((props, ref) => {
  const [personId, setPersonId] = useState<number>();
  const [personDetail, setPersonDetail] = useState<PersonInfoInter>({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    setPersonId: (personId: number) => {
      setPersonId(personId);
    },
    setIsDetailModalOpen: (isDetailModalOpen: boolean) => {
      setIsDetailModalOpen(isDetailModalOpen);
    },
  }));

  useEffect(() => {
    fetchPersonDetail();
  }, [personId]);

  const fetchPersonDetail = async () => {
    if (personId) {
      try {
        const res = await personApi.getPersonInfo(personId);
        if (res.status === 200) {
          setPersonDetail(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching person detail:", error);
      }
    }
  };

  return (
    <Modal
      title="详情"
      open={isDetailModalOpen}
      onOk={() => {
        setIsDetailModalOpen(false);
      }}
      onCancel={() => {
        setIsDetailModalOpen(false);
      }}
    >
      <Flex vertical>
        <Flex flex={1} vertical={false}>
          <div>
            <img
              src={
                personDetail.avatar
                  ? `http://localhost:3000/api/upload/avatar${personDetail.avatar}`
                  : defaultAvatar
              }
              alt="Avatar"
              style={{ width: "15vw", height: "25vh", marginRight: "2vw" }}
            />
          </div>
          <Flex vertical justify="space-around">
            <p>姓名: {personDetail.name && personDetail.name}</p>
            <p>
              婚姻状况:{" "}
              {personDetail.married &&
                (personDetail.married === true ? "已婚" : "单身")}
            </p>
            <p>单位: {personDetail.unit && personDetail.unit.name}</p>
            <p>
              负责人:{" "}
              {personDetail.responsible && personDetail.responsible.name}
            </p>
          </Flex>
        </Flex>
        <Flex flex={1} vertical>
          {personDetail.records &&
            personDetail.records.map((record, index) => {
              return (
                <div key={index}>
                  <span style={{ marginRight: 5 }}>
                    <CaretRightOutlined
                      style={{
                        color:
                          getRecordLevel(record) === 1
                            ? "#E0A60F"
                            : getRecordLevel(record) === 2
                            ? "red"
                            : "green",
                      }}
                    />
                  </span>
                  <span
                    style={{
                      marginRight: 5,
                      color:
                        getRecordLevel(record) === 1
                          ? "#E0A60F"
                          : getRecordLevel(record) === 2
                          ? "red"
                          : "green",
                    }}
                  >
                    情况{index + 1}:{record.problem?.name} 程度:
                    {getRecordLevel(record) === 0
                      ? "一般"
                      : getRecordLevel(record) === 1
                      ? "重要"
                      : "急迫"}
                  </span>
                  <p
                    style={{
                      marginRight: 5,
                      marginTop: 0,
                      marginBottom: 0,
                    }}
                  >
                    记录时间:
                    {dateformat(record.createdAt, "yyyy-mm-dd HH:MM:ss")}
                  </p>
                  <p
                    style={{
                      marginRight: 5,
                      marginTop: 0,
                      marginBottom: 0,
                    }}
                  >
                    当前情况:
                    {record.record_Developments?.length === 0
                      ? "无"
                      : (
                          record.record_Developments as RecordDevelopmentInter[]
                        )[0].detail}
                  </p>
                  <p style={{ marginRight: 5, marginTop: 0, marginBottom: 0 }}>
                    帮带措施:
                    {record.record_Developments?.length === 0
                      ? "无"
                      : (
                          record.record_Developments as RecordDevelopmentInter[]
                        )[0].measure}
                  </p>
                  <span style={{ marginRight: 5 }}>
                    备注:
                    {record.record_Developments?.length === 0
                      ? "无"
                      : (
                          record.record_Developments as RecordDevelopmentInter[]
                        )[0].comment}
                  </span>
                </div>
              );
            })}
        </Flex>
      </Flex>
    </Modal>
  );
});

export default DetailModal;
