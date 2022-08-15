const courses = ({ title, author, image, price, bestseller }) => {
  return `<div class="courseItemContent">
        <img src="${image}">
        <h3>${title}</h3>
        <p class="courseAuthor">${author}</p>
        <p class="coursePrice">E£ ${price}</p>
        ${bestseller ? '<p class="courseBestseller">Bestseller</p>' : ""}
    </div>`;
};

const newCourses = async (search) => {
  const coursesList = document.getElementsByClassName("coursesList")[0];
  const coursesInfo = await fetch(
    `${"http://localhost:3000/courses"}?title_like=${search}`
  ).then((p) => p.json());
  coursesInfo.forEach((item) => {
    coursesList.appendChild(
      new DOMParser().parseFromString(courses(item), "text/html").body
        .firstElementChild
    );
  });
};

const find = async () => {
  await newCourses("");
  const searchInfo = document.getElementById("box");
  const searchClick = document.getElementById("searchBut");
  searchClick.addEventListener("click", (e) => {
    e.preventDefault();
    newCourses(searchInfo.value);
  });
};

find();
