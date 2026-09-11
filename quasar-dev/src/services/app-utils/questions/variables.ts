export const extractVariablesFromText = (text: string) => {
  // Variable is indicated when a word starts with #
  // If it starts with \# it means the # is escaped and should not be treated as a variable
  const variableRegex = /(?<!\\)#(\w+)/g;
  const variables: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = variableRegex.exec(text)) !== null) {
    const variableName = match[1];
    if (variableName !== undefined && !variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  return variables;
}
