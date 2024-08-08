import React, { useState } from "react";

import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import style from "./basicinfo.module.scss";
import { Collapse } from "antd";
import { useEffect } from "react";
import BasicInfoCard from "../../components/BasicInfoCard/BasicInfoCard";

const App: React.FC = () => {
  const [peopleList, setPeopleList] = useState<PersonInfoInter[]>([]);
  // const [responsibleList, setPResponsibleList] = useState<ResponsibleInter[]>(
  //   []
  // );
  const [userJWT, setUserJWT] = useState<any>([]);
  const [currentPersonId, setCurrentPersonId] = useState<number>(0);
  // store异步获取responsibleData
  const fetchResponsibleData = async (unitId: number) => {
    await store.getResponsibleByUnit(unitId);
    // const responsibleData = toJS(store.responsible);
    // setPResponsibleList(responsibleData);
    // console.log("----responsibleData", responsibleData);
  };
  // store异步获取peopleData
  const fetchPeopleData = async (unitId: number) => {
    await store.getPeopleByUnit(unitId);
    const peopleData = toJS(store.people);
    setPeopleList(peopleData);
    console.log("----peopleData", peopleData);
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

  return (
    <Collapse defaultActiveKey={["1"]}>
      <div className={style["card-container"]}>
        {peopleList
          ? peopleList.map((person: PersonInfoInter) => (
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
    </Collapse>
  );
};

export default App;
