let allIssues = [];

const removeAllBtnClass = () => {
  const btns = document.querySelectorAll("main > section .btn");
  btns.forEach((btn) => btn.classList.remove("btn-primary"));
};

function manageSpinner(status) {
  const spinnerContainer = document.getElementById("spinner");
  if (status) {
    spinnerContainer.classList.remove("hidden");
  } else {
    spinnerContainer.classList.add("hidden");
  }
}

function btnEvent(id) {
  console.log(allIssues);
  const btn = document.getElementById(id);
  removeAllBtnClass();
  btn.classList.add("btn-primary");

  const onlyIdWiseData = allIssues.filter((issue) => issue.status === id);
  const value = document.getElementById("issues-count");
  if (id === "all") {
    value.innerText = allIssues.length;
    displayIssues(allIssues);
  } else {
    value.innerText = onlyIdWiseData.length;
    displayIssues(onlyIdWiseData);
  }
}

const loadIssues = () => {
  manageSpinner(true);
  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((json) => {
      allIssues = json.data;
      displayIssues(json.data);
      manageSpinner(false);
    });
};

// {
//     "id": 1,
//     "title": "Fix navigation menu on mobile devices",
//     "description": "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.",
//     "status": "open",
//     "labels": [
//         "bug",
//         "help wanted"
//     ],
//     "priority": "high",
//     "author": "john_doe",
//     "assignee": "jane_smith",
//     "createdAt": "2024-01-15T10:30:00Z",
//     "updatedAt": "2024-01-15T10:30:00Z"
// }

function getIssueLevel(labels) {
  const htmlElements = labels.map((label) => {
    if (label === "bug")
      return `<span
            class="bg-red-200/50 text-red-600 px-2 py-1 rounded-full border-2 border-red-300 small flex items-center justify-center gap-1"
            ><i class="fa-solid fa-bug"></i> BUG</span
        >`;
    else if (label === "help wanted")
      return `<span
            class="bg-amber-200/50 text-amber-600 px-2 py-1 rounded-full border-2 border-amber-300 small flex items-center justify-center gap-1"
            ><i class="fa-regular fa-life-ring"></i></i> HELP WANTED</span
        >
    `;
    else
      return `<span
            class="bg-green-200/50 text-green-600 px-2 py-1 rounded-full border-2 border-green-300 small flex items-center justify-center gap-1"
            ><i class="fa-solid fa-wand-magic-sparkles"></i>${label.toUpperCase()}</span
        >`;
  });
  return htmlElements.join("");
}

const displayIssues = (data) => {
  const issuesContainer = document.getElementById("issues-container");
  issuesContainer.innerHTML = "";
  data.forEach((issue) => {
    let issueCard = document.createElement("div");
    issueCard.onclick = () => showIssueModal(issue);

    issueCard.classList = `bg-white border-t-4 ${issue.status === "open" ? "border-t-green-500" : "border-t-[#A855F7]"}  rounded-xl shadow-sm flex flex-col`;
    issueCard.innerHTML = `

        <div class="p-4 space-y-2">
        <div class="flex justify-between">
        <img
        width="32"
            id="status-icon"
            src=${issue.status === "open" ? "./assets/Open-Status.png" : "./assets/Closed-Status.png"}
            alt=${issue.status}
        />

        <div id="priority" class="${issue.priority === "high" ? "text-red-400 bg-red-400/20" : issue.priority === "low" ? "text-gray-400 bg-gray-400/20" : "text-amber-400 bg-amber-400/20"}  px-4 py-1  rounded-full">${issue.priority.toUpperCase()}</div>
        </div>

        <h4 class="font-semibold">${issue.title}</h4>

        <p class="text-[#64748B]">
        ${issue.description}
        </p>

        <div id="labels" class="flex flex-wrap gap-1">
        ${getIssueLevel(issue.labels)}
        </div>
        </div>
        <div class="text-[#64748B] space-y-2 p-4 border-t border-t-gray-400/30 mt-auto">
        <p>#1 by ${issue.author}</p>
        <p>${issue.createdAt}</p>
        </div>
    </div>
  `;
    issuesContainer.appendChild(issueCard);
  });
};

function searchIssue() {
  removeAllBtnClass();
  const issuesContainer = document.getElementById("issues-container");
  issuesContainer.innerHTML = "";

  const searchText = document.getElementById("search-input").value;
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;
  manageSpinner(true);
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      const value = document.getElementById("issues-count");
      value.innerText = json.data.length;
      displayIssues(json.data);
      manageSpinner(false);
    });
}

const inputField = document.getElementById("search-input");
inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchIssue();
  }
});

const modalContainer = document.getElementById("modal-container");

function showIssueModal(issue) {
  modalContainer.innerHTML = "";
  let modalElement = document.createElement("div");
  modalElement.innerHTML = `<div class="p-1 space-y-2">
              <h1 class="text-xl font-semibold">${issue.title}</h1>
              <div class="flex gap-2 items-center text-[#64748B]">
                <span class="text-white px-4 py-2 ${issue.status === "open" ? "bg-green-600" : "bg-red-600"}  rounded-full"
                  >${issue.status === "open" ? "Opened" : "Closed"}</span
                >
                <i class="fa-solid fa-circle text-[8px]"></i> Opened by ${issue.assignee ? issue.assignee : "None"} <i class="fa-solid fa-circle text-[8px]"></i> 22/2/2025
              </div>
            </div>

            <div class="flex flex-wrap gap-1 my-2">
              ${getIssueLevel(issue.labels)}
            </div>

            <div class="text-xl text[#64748B] my-2">
              ${issue.description}
            </div>

            <div class="flex justify-between">
              <div>
                <p class="text-[#64748B]">Assignee:</p>
                <p class="font-semibold">${issue.assignee ? issue.assignee : "Assignee Not Found"}</p>
              </div>
              <div class="space-y-2">
                <p class="text-[#64748B]">Priority:</p>
                <div id="priority" class="${issue.priority === "high" ? "text-red-400 bg-red-400/20" : issue.priority === "low" ? "text-gray-400 bg-gray-400/20" : "text-amber-400 bg-amber-400/20"}  px-4 py-1  rounded-full">${issue.priority.toUpperCase()}</div>
              </div>
            </div>`;

  modalContainer.appendChild(modalElement);
  const modal = document.getElementById("my_modal_5");
  modal.showModal();
}

loadIssues();
