import React, { useState } from "react";

import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import store from "../../mobx_store/store";
import style from "./responsible.module.scss";
import { Collapse } from "antd";
import { useEffect } from "react";
import ResponsibleCard from "../../components/ResponsibleCard/ResponsibleCard";

const App: React.FC = () => {
  const [responsibleList, setResponsibleList] = useState<ResponsibleInter[]>(
    []
  );
  const [userJWT, setUserJWT] = useState<any>([]);
  const [currentResponsibleId, setCurrentResponsibleId] = useState<number>(0);
  // store异步获取responsibleData
  const fetchResponsibleData = async (unitId: number) => {
    await store.getResponsibleByUnit(unitId);
    const responsibleData = toJS(store.responsible);
    setResponsibleList(responsibleData);
    console.log("----responsibleData", responsibleData);
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
        fetchResponsibleData(userJWTData["unit_id"]);
      }
    };
    fetchData();
  }, []);

  return (
    <Collapse defaultActiveKey={["1"]}>
      <div className={style["card-container"]}>
        {responsibleList
          ? responsibleList.map((responsible: ResponsibleInter) => (
              <ResponsibleCard
                responsibleinfo={responsible}
                key={responsible.id}
                unit_id={responsible.unit_id as number}
                fetchResponsibleData={fetchResponsibleData}
              />
            ))
          : []}
        <ResponsibleCard
          initialStatus="+"
          unit_id={userJWT.unit_id}
          fetchResponsibleData={fetchResponsibleData}
        ></ResponsibleCard>
      </div>
    </Collapse>
  );
};

export default App;
