import React, { useState } from "react";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import style from "./basicinfo.module.scss";
import { Collapse, message, CollapseProps } from "antd";
import { useEffect } from "react";
import BasicInfoCard from "../../components/BasicInfoCard/BasicInfoCard";
import { personApi, responsibleApi } from "../../api";

const App: React.FC = () => {
  const [peopleWithUnsolvedRecords, setPeopleWtihUnsolvedRecords] = useState<
    PersonInfoInter[]
  >([]);
  const [peopleSolved, setPeopleSolved] = useState<PersonInfoInter[]>([]);
  const [responsibleList, setResponsibleList] = useState<ResponsibleInter[]>(
    []
  );

  const [userJWT, setUserJWT] = useState<any>([]);
  // store异步获取responsibleData
  const fetchResponsibleData = async (unitId: number) => {
    try {
      const res = await responsibleApi.getResponsibleByUnit(unitId);
      if (res.status === 200) {
        setResponsibleList(res.data.data);
      }
    } catch (err) {
      message.error("获取数据失败");
    }
  };
  // store异步获取peopleData
  const fetchPeopleData = async (unitId: number) => {
    try {
      const res = await personApi.getPeopleByUnitId(unitId);
      if (res.status === 200) {
        setPeopleWtihUnsolvedRecords(res.data.data.peopleWithUnsolvedRecords);
        setPeopleSolved(res.data.data.peopleSolved);
      }
    } catch (err) {
      message.error("获取数据失败");
    }
  };
  // store异步获取userJWT
  const fetchUserJWT = async (): Promise<any> => {
    await store.getUserJWT();
    const userJWT = toJS(store.userInfo);
    setUserJWT(userJWT);
    return userJWT;
  };

  // 页面初始化加载数据
  useEffect(() => {
    const fetchData = async () => {
      const userJWTData = await fetchUserJWT();
      if (userJWTData !== null) {
        fetchPeopleData(userJWTData["unit_id"]);
        fetchResponsibleData(userJWTData["unit_id"]);
      }
    };
    fetchData();
  }, []);

  const collapseItems: CollapseProps["items"] = [
    {
      key: "1",
      label: `现有重点人:${
        peopleWithUnsolvedRecords && peopleWithUnsolvedRecords.length
      }`,
      children: (
        <div className={style["card-container"]}>
          {peopleWithUnsolvedRecords
            ? peopleWithUnsolvedRecords.map((person: PersonInfoInter) => (
                <BasicInfoCard
                  personinfo={person}
                  key={person.id}
                  unit_id={person.unit_id as number}
                  fetchPeopleData={fetchPeopleData}
                />
              ))
            : []}
          <BasicInfoCard
            initialStatus="+"
            unit_id={userJWT.unit_id}
            fetchPeopleData={fetchPeopleData}
          ></BasicInfoCard>
        </div>
      ),
    },
    {
      key: "2",
      label: `已摘牌:${peopleSolved && peopleSolved.length}`,
      children: (
        <div className={style["card-container"]}>
          {peopleSolved
            ? peopleSolved.map((person: PersonInfoInter) => (
                <BasicInfoCard
                  personinfo={person}
                  key={person.id}
                  unit_id={person.unit_id as number}
                  fetchPeopleData={fetchPeopleData}
                />
              ))
            : []}
          <BasicInfoCard
            initialStatus="+"
            unit_id={userJWT.unit_id}
            fetchPeopleData={fetchPeopleData}
          ></BasicInfoCard>
        </div>
      ),
    },
  ];

  return <Collapse defaultActiveKey={["1"]} items={collapseItems}></Collapse>;
};

export default App;
