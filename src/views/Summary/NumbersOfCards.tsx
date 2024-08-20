import React, { useState, useEffect } from "react";
import { Select } from "antd";
import style from "./summary.module.scss";
import getPersonLevel from "../../utils/GetPersonRiskLevel";
import axios from "axios";

interface NumbersOfCardsInterface {
  peopleWtihUnsolvedRecords: PersonInfoInter[];
  userJWT: UserInfoInter;
  currentUnitId: number;
  handleChangeCurrentUnitId: (unid_id: number) => void;
}

const NumbersOfCards: React.FC<NumbersOfCardsInterface> = ({
  peopleWtihUnsolvedRecords,
  userJWT,
  currentUnitId,
  handleChangeCurrentUnitId,
}) => {
  const [unitList, setUnitList] = useState<UnitInter[]>([]);
  const [numberInCard, setNumberInCard] = useState<any[]>([0, 0, 0]);

  useEffect(() => {
    fetchUnitList();
  }, []);

  useEffect(() => {
    countNumberInCard(peopleWtihUnsolvedRecords);
  }, [peopleWtihUnsolvedRecords]);

  const fetchUnitList = async () => {
    const unitList = await axios.get("/unit");
    const _unitList = [{ id: 0, name: "大队总览" }, ...unitList.data.data];
    setUnitList(_unitList);
  };

  const countNumberInCard = (peopleWtihUnsolvedRecords: PersonInfoInter[]) => {
    const data: any[] = [
      { name: "急迫", value: 0 },
      { name: "重要", value: 0 },
      { name: "一般", value: 0 },
    ];
    peopleWtihUnsolvedRecords &&
      peopleWtihUnsolvedRecords.forEach((person) => {
        const level = getPersonLevel(person.records ? person.records : []);
        if (level === 2) {
          data[0].value++;
        } else if (level === 1) {
          data[1].value++;
        } else {
          data[2].value++;
        }
      });
    setNumberInCard(data);
  };

  const handleSelectChange = (unid_id: number) => {
    handleChangeCurrentUnitId(unid_id);
  };

  return (
    <div className={style.flexcard} style={{ height: "30%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginBottom: "10px",
        }}
      >
        {userJWT.role === "admin" && (
          <Select
            disabled={userJWT.role !== "admin"}
            defaultValue={currentUnitId}
            placeholder="请选择单位"
            style={{ width: 120 }}
            onChange={handleSelectChange}
            options={unitList}
            fieldNames={{ label: "name", value: "id" }}
          ></Select>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div
          className={style.numbercard}
          style={{
            background: "linear-gradient(to right, #bc0823, #f04646)",
          }}
        >
          红牌人数
          <div className={style.numberofpeople}>{numberInCard[0].value}</div>
        </div>
        <div
          className={style.numbercard}
          style={{
            background: "linear-gradient(to right, #E0A60F, #FFC50F)",
          }}
        >
          黄牌人数
          <div className={style.numberofpeople}>{numberInCard[1].value}</div>
        </div>
        <div
          className={style.numbercard}
          style={{
            background: "linear-gradient(to right, #039B0F, #2ED30F)",
          }}
        >
          绿牌人数
          <div className={style.numberofpeople}>{numberInCard[2].value}</div>
        </div>
      </div>
    </div>
  );
};

export default NumbersOfCards;
