const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", () => {
  const userName = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (userName === "admin" && password === "admin123") {
    window.location.assign("./home.html");
  } else {
    alert("Username or Password is wrong!");
  }
});
