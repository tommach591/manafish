//const serverURL = "http://localhost:3001";
const serverURL = "https://manafish-server-47d29a19afc3.herokuapp.com";

export function getAllBalance() {
  return fetch(`${serverURL}/api/balance/allBalances`)
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}

export function getBalance(userID) {
  return fetch(`${serverURL}/api/balance/user/${userID}`)
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}

export function createBalance(userIDEntered) {
  const body = {
    userID: userIDEntered,
  };

  return fetch(`${serverURL}/api/balance/create`, {
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

export function updateBalance(userIDEntered, updatedBody) {
  const body = { userID: userIDEntered };
  if (updatedBody.mana !== undefined) body.mana = updatedBody.mana;
  if (updatedBody.storedMana !== undefined)
    body.storedMana = updatedBody.storedMana;
  if (updatedBody.maxStoredMana !== undefined)
    body.maxStoredMana = updatedBody.maxStoredMana;
  if (updatedBody.lastManaInterval !== undefined)
    body.lastManaInterval = updatedBody.lastManaInterval;
  if (updatedBody.nextManaInterval !== undefined)
    body.nextManaInterval = updatedBody.nextManaInterval;
  if (updatedBody.currentProfileIcon !== undefined)
    body.currentProfileIcon = updatedBody.currentProfileIcon;
  if (updatedBody.profileIcons !== undefined)
    body.profileIcons = updatedBody.profileIcons;

  return fetch(`${serverURL}/api/balance/update`, {
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
