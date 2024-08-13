const formatCatagory = (catagory: number) => {
  switch (catagory) {
    case 0:
      return "干部";
    case 1:
      return "军士";
    case 2:
      return "文职";
    default:
      break;
  }
};

export default formatCatagory;
