//const serverURL = "http://localhost:3001";
const serverURL = "https://manafish-server-47d29a19afc3.herokuapp.com/";

export function getAllAccount() {
  return fetch(`${serverURL}/api/account/allAccounts`)
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}

export function loginAccount(usernameEntered, passwordEntered) {
  const body = {
    username: usernameEntered,
    password: passwordEntered,
  };

  return fetch(`${serverURL}/api/account/login`, {
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

export function createAccount(usernameEntered, passwordEntered) {
  const body = {
    username: usernameEntered,
    password: passwordEntered,
  };

  return fetch(`${serverURL}/api/account/signup`, {
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

export function deleteAccount(usernameEntered, passwordEntered) {
  const body = {
    username: usernameEntered,
    password: passwordEntered,
  };

  return fetch(`${serverURL}/api/account/delete`, {
    method: "DELETE",
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
