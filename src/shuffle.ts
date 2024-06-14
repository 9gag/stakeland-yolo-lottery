export const shuffle = (array: any[], random: () => number) => {
  array = [...array];

  for (let index = array.length - 1; index > 0; index--) {
    const newIndex = Math.floor(random() * (index + 1));
    [array[index], array[newIndex]] = [array[newIndex], array[index]];
  }

  return array;
};
