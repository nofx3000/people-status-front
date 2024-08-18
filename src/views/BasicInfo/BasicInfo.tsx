import React, { useState } from "react";

import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import style from "./basicinfo.module.scss";
import { Collapse, message, Divider, Card, CollapseProps } from "antd";
import { useEffect } from "react";
import BasicInfoCard from "../../components/BasicInfoCard/BasicInfoCard";
import axios from "axios";

const App: React.FC = () => {
  const [peopleWtihUnsolvedRecords, setPeopleWtihUnsolvedRecords] = useState<
    PersonInfoInter[]
  >([]);
  const [peopleSolved, setPeopleSolved] = useState<PersonInfoInter[]>([]);
  const [responsibleList, setResponsibleList] = useState<ResponsibleInter[]>(
    []
  );
  // const [responsibleList, setPResponsibleList] = useState<ResponsibleInter[]>(
  //   []
  // );
  const [userJWT, setUserJWT] = useState<any>([]);
  const [currentPersonId, setCurrentPersonId] = useState<number>(0);
  // store异步获取responsibleData
  const fetchResponsibleData = async (unitId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/responsible/unit/${unitId}`
      );
      setResponsibleList(res.data.data);
    } catch (err) {
      message.error("获取数据失败");
    }
    // await store.getResponsibleByUnit(unitId);
    // const responsibleData = toJS(store.responsible);
    // setPResponsibleList(responsibleData);
    // console.log("----responsibleData", responsibleData);
  };
  // store异步获取peopleData
  const fetchPeopleData = async (unitId: number) => {
    // await store.getPeopleByUnit(unitId);
    // const peopleData = toJS(store.people);
    // setPeopleList(peopleData);
    // console.log("----peopleData", peopleData);
    try {
      const res = await axios.get(`http://localhost:3000/api/people/${unitId}`);
      setPeopleWtihUnsolvedRecords(res.data.data.peopleWithUnsolvedRecords);
      setPeopleSolved(res.data.data.peopleSolved);
      console.log(res.data.data);
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
        peopleWtihUnsolvedRecords && peopleWtihUnsolvedRecords.length
      }`,
      children: (
        <div className={style["card-container"]}>
          {peopleWtihUnsolvedRecords
            ? peopleWtihUnsolvedRecords.map((person: PersonInfoInter) => (
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
