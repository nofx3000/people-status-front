import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Modal, Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import getPersonLevel from "../../utils/GetPersonRiskLevel";
import style from "./summary.module.scss";
import { useLocation } from "react-router-dom";

interface TableModalProps {
  peopleWtihUnsolvedRecords: PersonInfoInter[];
  onDetailClick: (personId: number) => void;
}

const TableModal = forwardRef<
  { setIsTableModalOpen: (isOpen: boolean) => void },
  TableModalProps
>(({ peopleWtihUnsolvedRecords, onDetailClick }, ref) => {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const number = searchParams.get("number");

  useImperativeHandle(ref, () => ({
    setIsTableModalOpen: (isOpen: boolean) => {
      setIsTableModalOpen(isOpen);
    },
  }));

  const columns: ColumnsType<PersonInfoInter> = [
    {
      title: "程度",
      dataIndex: "level",
      key: "level",
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        getPersonLevel(a.records as RecordInter[]) -
        getPersonLevel(b.records as RecordInter[]),
      render: (_, person) => {
        const level = getPersonLevel(person.records ? person.records : []);
        return (
          <div
            style={{
              width: "4vw",
              height: "4vh",
              borderRadius: "1vh",
              backgroundColor:
                level === 0 ? "green" : level === 1 ? "#E0A60F" : "#c23531",
            }}
          />
        );
      },
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "单位",
      dataIndex: "unit",
      key: "unit",
      render: (_, person) => <span>{person.unit?.name}</span>,
    },
    {
      title: "类型",
      dataIndex: "catagory",
      key: "catagory",
      render: (_, person) => (
        <span>
          {person.catagory === 0
            ? "干部"
            : person.catagory === 1
            ? "战士"
            : "文职"}
        </span>
      ),
    },
    {
      title: "涉及问题",
      dataIndex: "problem",
      key: "problem",
      width: 380,
      render: (_, person) => {
        if (!person.records) return <p>无</p>;
        return (
          <div>
            {person.records.map((record, index) => (
              <p
                style={{ lineHeight: "2vh", marginBottom: 1, marginTop: 1 }}
                key={index}
              >
                •{record.problem?.name}
              </p>
            ))}
          </div>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "option",
      key: "option",
      render: (_, person) => (
        <Button
          onClick={() => {
            onDetailClick(person.id as number);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  // 根据 number 参数筛选数据
  const filteredData =
    number !== null
      ? peopleWtihUnsolvedRecords.filter(
          (person) => getPersonLevel(person.records || []) === parseInt(number)
        )
      : peopleWtihUnsolvedRecords;

  return (
    <Modal
      title="人员列表"
      open={isTableModalOpen}
      onOk={() => setIsTableModalOpen(false)}
      onCancel={() => setIsTableModalOpen(false)}
      width="80vw"
      //   style={{
      //     top: "50%",
      //     transform: "translateY(-50%)",
      //   }}
      style={{
        maxHeight: "80vh",
        overflow: "auto",
      }}
    >
      <Table
        columns={columns}
        dataSource={filteredData}
        // className={style.table}
        rowKey={(row) => row.id as any}
        scroll={{ y: "calc(60vh - 120px)" }} // 减去标题和分页的高度
        pagination={{ pageSize: 10 }}
      />
    </Modal>
  );
});

export default TableModal;
