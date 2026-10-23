import type { GSK_STUDENT_ANSWER } from "@/library/types/variables";
export const getOuterStyleFromInputStyle = (
  inputStyle: GSK_STUDENT_ANSWER["style"],
): string => {
  return `
    min-width: ${inputStyle.width}${inputStyle.widthUnit};
    max-width: ${inputStyle.width}${inputStyle.widthUnit};
    font-size: ${inputStyle.fontSize}${inputStyle.fontSizeUnit};
    border-radius: ${inputStyle.borderRadius}${inputStyle.borderRadiusUnit};
    border: ${inputStyle.borderThickness}${inputStyle.borderThicknessUnit} ${inputStyle.borderStyle} ${inputStyle.borderColor};
    zoom: ${inputStyle.zoom};
    background-color: ${inputStyle.backgroundColor};
  `;
};

export const getInnerStyleFromInputStyle = (
  inputStyle: GSK_STUDENT_ANSWER["style"],
): string => {
  return `
    text-align: ${inputStyle.textAlign};
    color: ${inputStyle.textColor};
  `;
};
