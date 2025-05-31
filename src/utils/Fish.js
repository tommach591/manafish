//const serverURL = "http://localhost:3001";
const serverURL = "https://manafish-server-47d29a19afc3.herokuapp.com/";

export function getAllFish() {
  return fetch(`${serverURL}/api/fish/allFish`)
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}

export function getFish(userID) {
  return fetch(`${serverURL}/api/fish/user/${userID}`)
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}

export function createFish(userIDEntered) {
  const body = {
    userID: userIDEntered,
  };

  return fetch(`${serverURL}/api/fish/create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}

export function updateFish(userIDEntered, updatedBody) {
  const body = { userID: userIDEntered };
  if (updatedBody.fishCaught !== undefined)
    body.fishCaught = updatedBody.fishCaught;

  return fetch(`${serverURL}/api/fish/update`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}
