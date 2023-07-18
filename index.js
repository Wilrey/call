// Make sure to enable Placing calls with another app? on Call -> Settings -> Phone Settings

const CLIENT_ID = 'ee4696b8-16c4-40ce-87ae-7322597880ac';
const ENVIRONMENT = 'mypurecloud.de';
const form = document.querySelector("#login");
const phoneInput = document.querySelector("#phone");
const info = document.querySelector(".alert");

document.addEventListener("DOMContentLoaded", init);

function init() {
  form.addEventListener("submit", process);
  if (window.location.hash) {
    handleAPIRequest();
  } else {
    redirectForAuthorization();
  }
}

function process(event) {
  event.preventDefault();
  const phoneNumber = phoneInput.value;
  const queue = '07b54d9e-b08b-4587-a4bd-7e0055ebed0b';
  info.innerHTML = `Placing call to Phone number in E.164 format: <strong>${phoneNumber}</strong>`;
  placeCall(phoneNumber, queue);
}

function handleAPIRequest() {
  const token = getParameterByName('access_token');
  const apiRequests = [
    $.ajax({
      url: `https://api.${ENVIRONMENT}/api/v2/conversations/calls`,
      type: "post",
      data: JSON.stringify({
        "phoneNumber": phoneInput.value,
        "callFromQueueId": '07b54d9e-b08b-4587-a4bd-7e0055ebed0b'
      }),
      contentType: "application/json; charset=utf-8",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'bearer ' + token);
      }
    }),
    $.ajax({
      url: `https://api.${ENVIRONMENT}/api/v2/users/me`,
      type: "GET",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'bearer ' + token);
      }
    })
  ];

  Promise.all(apiRequests)
    .then(function(results) {
      console.log(results[0]); // Result of the first API request
      console.log(results[1]); // Result of the second API request
    })
    .catch(function(error) {
      console.error(error);
    });
}

function redirectForAuthorization() {
  const queryStringData = {
    response_type: "token",
    client_id: CLIENT_ID,
    redirect_uri: "https://wilrey.github.io/call/index.html"
  };
  window.location.replace(`https://login.${ENVIRONMENT}/oauth/authorize?` + jQuery.param(queryStringData));
}

function getParameterByName(name) {
  name = name.replace(/[\\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\#&]" + name + "=([^&#]*)");
  const results = regex.exec(location.hash);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
