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
const profileImages = importAll(
  require.context("../assets/profileImage", false, /\.(png|jpe?g|svg)$/)
);

export function getProfileIconList() {
  const length = Object.keys(profileImages).length;
  const profileIconList = Array.from({ length: length }, (_, i) => i);
  return profileIconList;
}

export function getProfileIcon(index) {
  return profileImages[`${index}.png`];
}

const borderImages = importAll(
  require.context("../assets/borderImage", false, /\.(png|jpe?g|svg)$/)
);

export function getProfileBorderList() {
  const length = Object.keys(borderImages).length;
  const profileBorderList = Array.from({ length: length }, (_, i) => i);
  return profileBorderList;
}

export function getProfileBorder(index) {
  return borderImages[`${index}.png`];
}
