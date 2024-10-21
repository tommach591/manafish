function importAll(folder) {
  let images = {};
  const sortedFolder = folder.keys().sort((first, second) => {
    const firstNumber = Number(first.replace(/\D/g, ""));
    const secondNumber = Number(second.replace(/\D/g, ""));
    if (firstNumber > secondNumber) return 1;
    else if (secondNumber > firstNumber) return -1;
    else return 0;
  });

  sortedFolder.map((item, index) => {
    return (images[item.replace("./", "")] = folder(item));
  });

  return images;
}
const images = importAll(
  require.context("../assets/plantImage", false, /\.(png|jpe?g|svg)$/)
);

export function getPlantImage(index) {
  return images[`${index}.png`];
}
