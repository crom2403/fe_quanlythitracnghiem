const CustomObjArrayFilter = (objArray, attributes, conditionIndexs) => {
    if (
      !attributes ||
      attributes.length === 0 ||
      !conditionIndexs ||
      conditionIndexs.length === 0
    ) {
      return objArray;
    }
    return objArray.filter((obj) => {
      return attributes.every((attribute, index) => {
        const conditionIndex = conditionIndexs[index];
        // Nếu conditionIndex là 0 (ví dụ: "Tất cả"), bỏ qua lọc cho thuộc tính này
        return conditionIndex === 0 || obj[attribute] === conditionIndex;
      });
    });
  };

// objArray: [{'Vi sao con ca biet boi',1,2,2},{'Vi sao con chim biet bay',2,1,2}]
//attributes: ['subject','chapters']
//conditionIndexs: [1,2]
export default CustomObjArrayFilter;
