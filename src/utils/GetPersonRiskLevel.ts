const getPersonLevel = (records: RecordInter[]) => {
  let max = 0;
  for (const record of records) {
    if (
      !record.record_Developments ||
      record.record_Developments.length === 0
    ) {
      continue;
    }
    const development = record.record_Developments as RecordDevelopmentInter[];
    if ((development[0].risk_level as number) > max) {
      max = development[0].risk_level as number;
    }
  }
  return max;
};

export default getPersonLevel;
