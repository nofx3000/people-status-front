import React, { useEffect, useState } from "react";
import store from "../../mobx_store/store";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import type { PopconfirmProps } from "antd";
import { Select, Button, Card, Timeline, Popconfirm, message } from "antd";
import axios from "axios";
import dateFormat from "dateformat";

import RecordForm from "../../components/RecordForm/RecordForm";

const PeopleStatus: React.FC = observer(() => {
  //在页面加载完成前调用store中的getProblems方法
  const [peopleList, setPeopleList] = useState<PersonInfoInter[]>([]);
  const [userJWT, setUserJWT] = useState<UserInfoInter>({});
  const [currentPersonId, setCurrentPersonId] = useState<number>(0);
  const [personRecords, setPersonRecords] = useState<RecordInter[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // store异步获取peopleData
  const fetchPeopleData = async (unitId: number) => {
    await store.getPeopleByUnit(unitId);
    const peopleData = toJS(store.people);
    setPeopleList(peopleData);
    console.log("peopleData", peopleData);
  };
  // store异步获取userJWT
  const fetchUserJWT = async (): Promise<any> => {
    await store.getUserJWT();
    const userJWT = toJS(store.userInfo);
    setUserJWT(userJWT);
    return userJWT;
  };
  // 根据currentPersonId获取records
  const fetchPersonRecord = async (currentPersonId: number) => {
    const personRecordsData = await axios.get(
      `/record/person/${currentPersonId}`
    );
    setPersonRecords(personRecordsData.data.data);
  };
  // 页面初始化加载数据
  useEffect(() => {
    const fetchData = async () => {
      const userJWTData = await fetchUserJWT();
      if (userJWTData !== null) {
        fetchPeopleData(userJWTData["unit_id"]);
      }
    };
    fetchData();
  }, []);
  // 监听currentPersonId，更新时获取record数据
  useEffect(() => {
    fetchPersonRecord(currentPersonId);
  }, [currentPersonId]);
  const onChange = (value: number) => {
    setCurrentPersonId(value);
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  const onAddButtonClick = () => {
    setIsAdding(true);
  };

  const confirm = (record_id: number) => {
    console.log(123);
    deleteRecord(record_id);
  };

  const deleteRecord = async (record_id: number) => {
    const res = await axios.delete(`/record/${record_id}`);
    if (res.status === 200) {
      message.success("删除成功");
      fetchPersonRecord(userJWT["unit_id"] as number);
    } else {
      message.error("删除失败");
    }
  };

  return (
    <>
      <div>
        用户名:{userJWT.username} 单位ID:{userJWT.unit_id} 权限角色:{" "}
        {userJWT.role}
      </div>
      <Select
        showSearch
        defaultValue={currentPersonId === 0 ? undefined : currentPersonId}
        placeholder="Select a person"
        optionFilterProp="label"
        onChange={onChange}
        onSearch={onSearch}
        options={peopleList}
        fieldNames={{ label: "name", value: "id" }}
      />
      {currentPersonId !== 0 ? (
        <Button type="primary" shape="circle" onClick={onAddButtonClick}>
          +
        </Button>
      ) : null}

      {isAdding ? (
        <Card style={{ width: "70vw" }}>
          <RecordForm
            fetchPersonRecord={fetchPersonRecord}
            setIsAdding={setIsAdding}
            currentPersonId={currentPersonId}
          />
        </Card>
      ) : null}

      <Timeline
        mode="left"
        items={
          personRecords != null
            ? personRecords.map((record, index) => {
                return {
                  color:
                    record.risk_level === 0
                      ? "green"
                      : record.risk_level === 1
                      ? "#E0A60F"
                      : "red",
                  // 用dateformat将label转换为中文标准日期
                  label: (
                    <>
                      {dateFormat(record.updatedAt, "yyyy年mm月dd日 HH:MM:ss")}
                      <div style={{ marginTop: 10 }}>
                        <Popconfirm
                          title="删除记录"
                          description="确定删除此条记录?"
                          onConfirm={() => confirm(record.id as number)}
                          // onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button danger ghost>
                            删除
                          </Button>
                        </Popconfirm>
                      </div>
                    </>
                  ),
                  children: (
                    <>
                      <p>问题类型：{record.problem?.name}</p>
                      <p>
                        程度：
                        {record.risk_level === 0
                          ? "一般"
                          : record.risk_level === 1
                          ? "重要"
                          : "急迫"}
                      </p>
                      <p>具体描述：{record.detail}</p>
                      <p>应对措施：{record.measure}</p>
                      <p>负责人：{record.responsible?.name}</p>
                    </>
                  ),
                };
              })
            : []
        }
      />
    </>
  );
});

export default PeopleStatus;
