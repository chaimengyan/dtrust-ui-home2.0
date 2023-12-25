// 回到上一步
export function previousStep(stepsListKind, flowType, currentStep) {
  const flowTypeList = stepsListKind[flowType]
  const index = flowTypeList.findIndex(x => x.value === currentStep)
  return flowTypeList[index-1].value
}