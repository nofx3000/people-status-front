const getRecordLevel = (record: RecordInter) => {
  if (!record.record_Developments) return 0;
  if (record.record_Developments.length === 0) return 0;
  return record.record_Developments[0].risk_level;
};

export default getRecordLevel;
