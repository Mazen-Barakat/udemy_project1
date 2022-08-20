let tabs = [
    "python",
    "excel",
    "webdevelopment",
    "Javascript",
    "datascience",
    "awscertification",
    "drawing",
  ],
  recordData = {
    python: {},
    excel: {},
    web: {},
    js: {},
    data: {},
    aws: {},
    draw: {},
  },
  activeTab = "python",
  cardsNumber = 4;

function getData() {
  for (let now of tabs)
    fetch(`http://localhost:3000/courses?name=${now}`)
      .then((res) => res.json())
      .then((data) => {
        data = data[0];
        recordData[now] = data;
        load_courses(activeTab);
      });
}

function courseCard(course) {
  if (!course) return "";
  let card = document.createElement("div");
  card.innerHTML = `
      <div class="col-lg-3 col-md-4 col-sm-12">
          <div class="courseCard">
              <div>
                  <img src="${course.image}" alt="${course.title}" />
              </div>
              <h4>${course.title}</h4>
              <div>
                  <p class="courseAuthor">${course.instructors[0].name}</p>
                 
                  <p class="coursePrice">E£${course.price}</p>
              </div>
          </div>
      </div>
  `;
  return card.innerHTML;
}

function activeCards(idx, courses) {
  let activeCards = ``;
  for (let cd = 0; cd < cardsNumber; cd++)
    activeCards += `${courseCard(courses[idx++])}\n`;
  return activeCards;
}

function activated(row) {
  return row === 0 ? "active" : "";
}

function coursesActive(courses, searchTXT) {
  if (!courses) return "";
  let coursesFiltered = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTXT.toLowerCase())
  );
  let nCourses = Math.ceil(coursesFiltered.length / cardsNumber);
  let coursesPage = ``;
  for (let rw = 0, idx = 0; rw < nCourses; rw++, idx += cardsNumber) {
    coursesPage += `
          <div class="carousel-item ${activated(rw)}">
              <div class="row">
                  ${activeCards(idx, coursesFiltered)}
              </div>
          </div>
      `;
  }
  return coursesPage;
}

function buttons(courses, searchTXT) {
  if (!courses) return "";
  let coursesFiltered = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTXT.toLowerCase())
  );
  if (coursesFiltered.length <= cardsNumber) return "";
  let buttons = `
      <div class="row">
          <div class="col-12">
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselHeader" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselHeader" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>
              </button>
          </div>
      </div>
  `;
  return buttons;
}

function load_courses(tab, searchTXT = "") {
  const courseInfo = recordData[tab];
  let activeCourses = document.createElement("div");
  activeCourses.innerHTML = `
      <h3 class="coursesDesc">${courseInfo.header}</h3>
      <p class="coursesDesc">${courseInfo.description}</p>
      <button class="explore">Explore ${`${tab}`}</button>
      <div class="coursesCards">
          <div class="container">
              <div class="row m-auto">
                  <div class="carousel slide" id="carouselHeader" data-ride="carousel" data-interval="false">
                      <div class="carousel-inner" role="listbox">
                          ${coursesActive(courseInfo.courses, searchTXT)}
                      </div>
                  </div>
              </div>
              ${buttons(courseInfo.courses, searchTXT)}
          </div>
      </div>
  `;

  let course = document.getElementById("coursesList");
  course.replaceChild(activeCourses, course.childNodes[0]);
}

const changeNCourses = (n) => {
  cardsNumber = n;
  const searchTXT = document.getElementById("box").value;
  load_courses(activeTab, searchTXT);
};

const mediaQuery = () => {
  let screens = [
    window.matchMedia("(min-width: 100px) and (max-width: 599px)"),
    window.matchMedia("(min-width: 600px) and (max-width: 699px)"),
    window.matchMedia("(min-width: 700px) and (max-width: 1000px)"),
    window.matchMedia("(min-width: 1200px)"),
  ];
  screens.forEach((screen, idx) => {
    screen.addListener((num) => {
      if (num.matches) changeNCourses(idx + 1);
    });
    if (screen.matches) changeNCourses(idx + 1);
  });
};

getData();

for (const now of tabs) {
  const tab_button = document.getElementById(now);
  tab_button.addEventListener("click", () => {
    activeTab = now;
    load_courses(activeTab);
  });
}

const button = document.getElementById("searchBut");
button.addEventListener("click", (e) => {
  e.preventDefault();
  const searchTXT = document.getElementById("box").value;
  load_courses(activeTab, searchTXT);
  document.getElementById("coursesBox");
});

const searchBar = document.getElementById("box");
searchBar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("searchBut").click();
  }
});

mediaQuery();
