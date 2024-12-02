import React, { useState, useEffect } from "react";
import { Select, Flex } from "antd";
import style from "./summary.module.scss";
import getPersonLevel from "../../utils/GetPersonRiskLevel";
import { unitApi } from "../../api";
import { useNavigate, useLocation } from "react-router-dom";

interface NumbersOfCardsInterface {
  peopleWtihUnsolvedRecords: PersonInfoInter[];
  userJWT: UserInfoInter;
  currentUnitId: number;
  handleChangeCurrentUnitId: (unid_id: number) => void;
  openTableModal: () => void;
}

const NumbersOfCards: React.FC<NumbersOfCardsInterface> = ({
  peopleWtihUnsolvedRecords,
  userJWT,
  currentUnitId,
  handleChangeCurrentUnitId,
  openTableModal,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unitList, setUnitList] = useState<UnitInter[]>([]);
  const [numberInCard, setNumberInCard] = useState<any[]>([0, 0, 0]);

  useEffect(() => {
    fetchUnitList();
  }, []);

  useEffect(() => {
    countNumberInCard(peopleWtihUnsolvedRecords);
  }, [peopleWtihUnsolvedRecords]);

  const fetchUnitList = async () => {
    try {
      const res = await unitApi.getAllUnits();
      if (res.status === 200) {
        const _unitList = [{ id: 0, name: "大队总览" }, ...res.data.data];
        setUnitList(_unitList as any);
      }
    } catch (error) {
      console.error("Error fetching unit list:", error);
    }
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

  const handleCardClick = (number: number) => {
    // 构建新的 URL，保持当前路径但添加 query 参数
    const newSearch = new URLSearchParams(location.search);
    newSearch.set("number", number.toString());
    navigate(`${location.pathname}?${newSearch.toString()}`);
    openTableModal();
  };

  return (
    <Flex vertical style={{ height: "100%" }} justify="space-between">
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
      <Flex justify="space-around" style={{ flex: 1 }}>
        <div
          className={style.numbercard}
          style={{
            background: "linear-gradient(to right, #bc0823, #f04646)",
            cursor: "pointer",
          }}
          onClick={() => handleCardClick(2)}
        >
          红牌人数
          <div className={style.numberofpeople}>{numberInCard[0].value}</div>
        </div>
        <div
          className={style.numbercard}
          style={{
            background: "linear-gradient(to right, #E0A60F, #FFC50F)",
            cursor: "pointer",
          }}
          onClick={() => handleCardClick(1)}
        >
          黄牌人数
          <div className={style.numberofpeople}>{numberInCard[1].value}</div>
        </div>
        <div
          className={style.numbercard}
          style={{
            background: "linear-gradient(to right, #039B0F, #2ED30F)",
            cursor: "pointer",
          }}
          onClick={() => handleCardClick(0)}
        >
          绿牌人数
          <div className={style.numberofpeople}>{numberInCard[2].value}</div>
        </div>
      </Flex>
    </Flex>
  );
};

export default NumbersOfCards;
