// SCROLLING ANIMATIONS
var oldScrollY = window.scrollY;

window.onscroll = function () {
  // rotating logo animation
  var theta = (document.documentElement.scrollTop / 1000) % Math.PI;
  document.getElementById("giant-logo").style.transform = "rotate(" + theta + "rad)";

  // moving news on scroll animation
  var element = document.getElementById("news-box-container");
  if (isInViewport(element)) {
    if (oldScrollY < window.scrollY) {
      document.getElementById("news-box-container").scrollLeft += theta + 5;
    } else {
      document.getElementById("news-box-container").scrollLeft -= theta + 5;
    }
  }

  // moving events agenda on scroll animation
  var element = document.getElementById("agenda-box-container");
  if (isInViewport(element)) {
    if (oldScrollY < window.scrollY) {
      document.getElementById("agenda-box-container").scrollLeft += theta + 5;
    } else {
      document.getElementById("agenda-box-container").scrollLeft -= theta + 5;
    }
  }
  oldScrollY = window.scrollY;

  // definition background color change
  var elem = document.querySelector("p#definition-text");
  if (isInViewport(elem)) {
    document.getElementById("fourth-section").style.backgroundColor = "black";
    document.getElementsByClassName("text-highlight")[0].style.backgroundColor = "white";
    document.getElementsByClassName("text-highlight")[1].style.backgroundColor = "white";
  }

  var reset = document.querySelector("span#reset-viewport");
  if (isInViewport(reset)) {
    document.getElementById("fourth-section").style.backgroundColor = "white";
    document.getElementsByClassName("text-highlight")[0].style.backgroundColor = "white";
    document.getElementsByClassName("text-highlight")[1].style.backgroundColor = "white";
  }

  // agenda background color change -- to remove if news-agenda hidden
  var agenda_title = document.querySelector("h2#agenda-main-title");
  if (isInViewport(agenda_title)) {
    document.getElementById("seventh-section").style.backgroundColor = "#FA3005";
    document.getElementById("sixth-section").style.backgroundColor = "#FA3005";
    document.getElementById("contacts-section").style.backgroundColor = "#FA3005";
  }

  var contacts_title = document.querySelector("h2#contacts-main-title");
  if (isInViewport(contacts_title)) {
    document.getElementById("seventh-section").style.backgroundColor = "#7EE787"; // to remove if news-agenda hidden
    document.getElementById("sixth-section").style.backgroundColor = "#7EE787"; // to remove if news-agenda hidden
    document.getElementById("contacts-section").style.backgroundColor = "#7EE787"; // to remove if news-agenda hidde
    //document.getElementById("fifth-section").style.backgroundColor = "#7EE787"; // to remove if news-agenda NOT hidden
  } else {
    //document.getElementById("contacts-section").style.backgroundColor = "black"; // to remove if news-agenda NOT hidden
    //document.getElementById("fifth-section").style.backgroundColor = "black"; // to remove if news-agenda NOT hidden
  }

  // news background color change -- to remove if news-agenda hidden
  var news_title = document.querySelector("h2#news-main-title");
  if (isInViewport(news_title)) {
    document.getElementById("seventh-section").style.backgroundColor = "black";
    document.getElementById("sixth-section").style.backgroundColor = "black";
    document.getElementById("contacts-section").style.backgroundColor = "black";
  }
};

// add animations when entering viewport
function isInViewport(elem) {
  var bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}

var news_array = [];

// FETCH DATA FROM JSON

// news data
fetch("/content/news.json")
  .then((res) => res.json())
  .then((data) => {
    news_array = data;
  })
  .then(() => {
    news_array.forEach(function (news_item) {
      //var url = "<a class='news-box-anchor' href='https://www.google.it/' target='_blank'>";   // to remove if using the visible link in the news box
      var date = "<p class='news-date'>" + news_item.date + "</p>";
      var division = "<p class='news-division'>" + news_item.division + "</p>";
      var title = "<h3 class='news-title'>" + news_item.title + "</h3>";
      if (news_item.text.length > 120) {
        newText = news_item.text.substring(0, 120) + "...";
        var text = "<p class='news-text'>" + newText + "</p> <p class='news-text expand-trigger' onclick='populateModal(\"news\", "+news_item.id+")'>Read more ⇢</p>";
      } else {
        var text = "<p class='news-text'>" + news_item.text + "</p>";
      }

      var toNewsPage = "<a class='news-link news-text' href='"+news_item.url+"'>Go to the news ⇢</a>";
      

      var news_box = document.getElementById("news-box-container");
      news_box.innerHTML += "<div class='news-box'>" + date + division + title + text + toNewsPage + "</div></a>"; //if using url, add url before <div class='news-box'>
    });
  });

// agenda data
fetch("/content/agenda.json")
  .then((res) => res.json())
  .then((data) => {
    agenda_array = data;
  })
  .then(() => {
    agenda_array.forEach(function (agenda_item) {
      var status = "";
      var statusElem = "";
      if (agenda_item.status === "concluded") {
        status = "concluded";
        statusElem = "<p class='agenda-concluded'>CONCLUDED</p>";
      }
      //var url = "<a class='agenda-box-anchor' href='https://www.google.it/' target='_blank'>";  // to remove if using the visible link in the news box
      var date = "<p class='agenda-date'>" + agenda_item.date + "</p>";
      var division = "<p class='agenda-division'>" + agenda_item.division + "</p>";
      var type = "<p class='agenda-type'>" + agenda_item.type + "</p>";
      var title = "<h3 class='agenda-title'>" + agenda_item.title + "</h3>";

      if (agenda_item.text.length > 120) {
        newText = agenda_item.text.substring(0, 120) + "...";
        var text = "<p class='agenda-text'>" + newText + "</p> <p class='agenda-text expand-trigger' onclick='populateModal(\"event\", "+agenda_item.id+")'>Read more ⇢</p>";
      } else {
        var text = "<p class='agenda-text'>" + agenda_item.text + "</p>";
      }

      var toEventPage = "<a class='agenda-link agenda-text' href='"+agenda_item.url+"'>Go to the news ⇢</a>";
      var news_box = document.getElementById("agenda-box-container");
      news_box.innerHTML += "<div class='agenda-box " + status + "'>" + statusElem + date + division + type + title + text + toEventPage + "</div></a>"; //if using url, add url before <div class='news-box'>
    });
  });



function populateModal(type, id){
  var modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = "";
  if (type == 'news'){
    var item = news_array.find(x => x.id == id);
    modalContent.innerHTML = "<h3 class='modal-title'>"+item.title+"</h3><p class='modal-text'>"+item.text+"</p> <a class='modal-link' href='"+item.url+"'>Go to the news ⇢</a></div>";
  } else {
    var item = agenda_array.find(x => x.id == id);
    modalContent.innerHTML = "<h3 class='modal-title'>"+item.title+"</h3><p class='modal-text modal-subtitle-pill'><span class='to-upper'>"+item.type+ "</span> — " +item.division+"</p><p class='modal-text modal-subtitle-pill'><b><span class='to-upper'>Date:<span class='to-upper'></b> "+item.date+"</p><p class='modal-text'>"+item.text+"</p><a class='modal-link' href='"+item.url+"'>Go to the news ⇢</a></div>";

  }

  document.getElementById("modal-overlay").style.display = "flex";
  document.getElementById("expansion-container").style.display = "flex";
  document.body.style.overflowY = "hidden";
}

function closeModal(){
  document.getElementById("modal-overlay").style.display = "none";
  document.getElementById("expansion-container").style.display = "none";
  document.getElementById("modal-content").innerHTML = "";
  document.body.style.overflowY = "auto";
}