const serverURL = "http://localhost:3001";

export function getAllAccount() {
  return fetch(`${serverURL}/api/account/allAccounts`)
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}

export function loginAccount(id, pw) {
  const body = {
    userID: id,
    userPW: pw,
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

export function createAccount(id, pw) {
  const body = {
    userID: id,
    userPW: pw,
  };

  console.log("A");
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

export function deleteAccount(id, pw) {
  const body = {
    userID: id,
    userPW: pw,
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
