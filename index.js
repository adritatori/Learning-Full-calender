todoMain();

function todoMain() {
  const DEFAULT_OPTION = "Choose category";

  let inputElem,
    inputElem2,
    dateInput,
    dateInpute,
    timeInput,
    timeInpute,
    addButton,
    sortButton,
    selectElem,
    todoList = [],
    calendar,
    shortlistBtn,
    changeBtn,
    todoTable,
    draggingElement,
    currentPage = 1,
    itemsPerPage = Number.parseInt(localStorage.getItem("todo-itemsPerPage")) || 5,
    totalPages = 0,
    itemsPerPageSelectElem,
    paginationCtnr,
    todoModalCloseBtn;

  getElements();
  addListeners();
  initCalendar();
  load();
  renderRows(todoList);
  updateSelectOptions();

  function getElements() {
    inputElem = document.getElementsByTagName("input")[0];
    inputElem2 = document.getElementsByTagName("input")[1];
    dateInput = document.getElementById("dateInput");
    timeInput = document.getElementById("timeInput");
    dateInpute = document.getElementById("dateInpute");
    timeInpute = document.getElementById("timeInpute"); 
    addButton = document.getElementById("addBtn");
    sortButton = document.getElementById("sortBtn");
    selectElem = document.getElementById("categoryFilter");
    shortlistBtn = document.getElementById("shortlistBtn");
    changeBtn = document.getElementById("changeBtn");
    todoTable = document.getElementById("todoTable");
    itemsPerPageSelectElem = document.getElementById("itemsPerPageSelectElem");
    paginationCtnr = document.querySelector(".pagination-pages");
    todoModalCloseBtn = document.getElementById("todo-modal-close-btn");
  }

  function addListeners() {
    addButton.addEventListener("click", addEntry, false);
    sortButton.addEventListener("click", sortEntry, false);
    selectElem.addEventListener("change", multipleFilter, false);
    shortlistBtn.addEventListener("change", multipleFilter, false);

    todoModalCloseBtn.addEventListener("click", closeEditModalBox, false);

    changeBtn.addEventListener("click", commitEdit, false);

    todoTable.addEventListener("dragstart", onDragstart, false);
    todoTable.addEventListener("drop", onDrop, false);
    todoTable.addEventListener("dragover", onDragover, false);

    paginationCtnr.addEventListener("click", onPaginationBtnsClick, false);

    itemsPerPageSelectElem.addEventListener("change", selectItemsPerPage, false);
  }

  function addEntry(event) {

    let inputValue = inputElem.value;
    inputElem.value = "";

    let inputValue2 = inputElem2.value;
    
    inputElem2.value = "";

    let dateValue = dateInput.value;
 
    dateInput.value = "";

    let timeValue = timeInput.value;
   
    timeInput.value = "";

    let etimeValue = timeInpute.value;
   
    timeInpute.value = "";

    let eDateValue = dateInpute.value;
  
    eDateValue.value = "";
    
    let obj = {
      id: _uuid(),
      todo: inputValue,
      category: inputValue2,
      date: dateValue,
      time: timeValue,
      edate: eDateValue,
      etime: etimeValue,
      done: false,
    };

    renderRow(obj);

    todoList.push(obj);

    save();

    updateSelectOptions();

    addEvent(obj);

  }

  function updateSelectOptions() {
    let options = [];

    todoList.forEach((obj) => {
      options.push(obj.category);
    });

    let optionsSet = new Set(options);

    // empty the select options
    selectElem.innerHTML = "";

    let newOptionElem = document.createElement('option');
    newOptionElem.value = DEFAULT_OPTION;
    newOptionElem.innerText = DEFAULT_OPTION;
    selectElem.appendChild(newOptionElem);

    for (let option of optionsSet) {
      let newOptionElem = document.createElement('option');
      newOptionElem.value = option;
      newOptionElem.innerText = option;
      selectElem.appendChild(newOptionElem);
    }


  }

  function save() {
    let stringified = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringified);
  }

  function load() {
    let retrieved = localStorage.getItem("todoList");
    todoList = JSON.parse(retrieved);
    //console.log(typeof todoList)
    if (todoList == null)
      todoList = [];
    
    itemsPerPageSelectElem.value = itemsPerPage;
  }

  function renderRows(arr) {

    renderPageNumbers(arr);
    currentPage = currentPage > totalPages ? totalPages : currentPage;

    arr.forEach(addEvent);

    let slicedArr = arr.slice(itemsPerPage * (currentPage - 1), itemsPerPage * currentPage);
    slicedArr.forEach(todoObj => {
      renderRow(todoObj);
    })
  }

  function renderRow({ todo: inputValue, category: inputValue2, id, date, time,edate, etime, done }) {
    // add a new row

    let trElem = document.createElement("tr");
    todoTable.appendChild(trElem);
    trElem.draggable = "true";
    trElem.dataset.id = id;

    // checkbox cell
    let checkboxElem = document.createElement("input");
    checkboxElem.type = "checkbox";
    checkboxElem.addEventListener("click", checkboxClickCallback, false);
    checkboxElem.dataset.id = id;
    let tdElem1 = document.createElement("td");
    tdElem1.appendChild(checkboxElem);
    trElem.appendChild(tdElem1);

    // date cell
    let dateElem = document.createElement("td");
    dateElem.innerText = date; //formatDate(date);
    trElem.appendChild(dateElem);

    // time cell
    let timeElem = document.createElement("td");
    timeElem.innerText = time;
    trElem.appendChild(timeElem);

    // date cell
    let edateElem = document.createElement("td");
    dateElem.innerText = edate; //formatDate(date);
    trElem.appendChild(edateElem);

    // time cell
    let etimeElem = document.createElement("td");
    timeElem.innerText = etime;
    trElem.appendChild(etimeElem);

    // to-do cell
    let tdElem2 = document.createElement("td");
    tdElem2.innerText = inputValue;
    trElem.appendChild(tdElem2);

    // category cell
    let tdElem3 = document.createElement("td");
    tdElem3.innerText = inputValue2;
    tdElem3.className = "categoryCell";
    trElem.appendChild(tdElem3);

    // edit cell
    let editSpan = document.createElement("span");
    editSpan.innerText = "edit";
    editSpan.className = "material-icons";
    editSpan.addEventListener("click", toEditItem, false);
    editSpan.dataset.id = id;
    let editTd = document.createElement("td");
    editTd.appendChild(editSpan);
    trElem.appendChild(editTd);


    // delete cell
    let spanElem = document.createElement("span");
    spanElem.innerText = "delete";
    spanElem.className = "material-icons";
    spanElem.addEventListener("click", deleteItem, false);
    spanElem.dataset.id = id;
    let tdElem4 = document.createElement("td");
    tdElem4.appendChild(spanElem);
    trElem.appendChild(tdElem4);


    // done button
    checkboxElem.type = "checkbox";
    checkboxElem.checked = done;
    if (done) {
      trElem.classList.add("strike");
    } else {
      trElem.classList.remove("strike");
    }

    dateElem.dataset.type = "date";
    //dateElem.dataset.value = date;
    timeElem.dataset.type = "time";
    tdElem2.dataset.type = "todo";
    tdElem3.dataset.type = "category";
    etimeElem.dataset.type ="time";
    edateElem.dataset.type="date";
    dateElem.dataset.id = id;
    timeElem.dataset.id = id;
     etimeElem.dataset.id = id;
     edateElem.dataset.id =id;
    tdElem2.dataset.id = id;
    tdElem3.dataset.id = id;

    function deleteItem() {
      trElem.remove();
      updateSelectOptions();

      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id)
          todoList.splice(i, 1);
      }
      save();

      // remove from calendar
      let calendarEvent = calendar.getEventById(this.dataset.id);
      if(calendarEvent !== null)
        calendarEvent.remove();
    }

    function checkboxClickCallback() {
      trElem.classList.toggle("strike");
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id)
          todoList[i]["done"] = this.checked;
      }
      save();
      multipleFilter();
    }

  }

  function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function sortEntry() {
    todoList.sort((a, b) => {
      let aDate = Date.parse(a.date);
      let bDate = Date.parse(b.date);
      return aDate - bDate;
    });

    save();

    clearTable();

    renderRows(todoList);
  }

  function initCalendar() {
    var calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
      eventDurationEditable:true,
    
      nowIndicator: true,
      initialView: 'dayGridMonth',
      initialDate: new Date(),

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      dayMaxEvents: true, 
      events: [
      ],
      eventClick: function (info) {
        toEditItem(info.event);
      },
      views: {
        resourceTimelineThreeDays: {
          type: 'resourceTimeline',
          duration: { days: 3 },
          buttonText: '3 days'
        }
      },
      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar
      eventDrop: function (info, delta) {
        // calendarEventDragged(info.event);
      
          let id = info.event.id;
          console.log("end"+ info.event.end);
          let dateObj = new Date(info.event.start);
          let edateObj = new Date(info.event.end);

          console.log("dateobj "+ dateObj);
          console.log("edateobj "+ edateObj);

          let year = dateObj.getFullYear();
          let month = dateObj.getMonth() + 1;
          let date = dateObj.getDate();
          let hour = dateObj.getHours();
          let minute = dateObj.getMinutes();

          let eyear = edateObj.getFullYear();
          let emonth = edateObj.getMonth() + 1;
          let edate = edateObj.getDate();
          let ehour = edateObj.getHours();
          let eminute = edateObj.getMinutes();




          let paddedMonth = month.toString();
          if (paddedMonth.length < 2) {
            paddedMonth = "0" + paddedMonth;
          }
      
          let paddedDate = date.toString();
          if (paddedDate.length < 2) {
            paddedDate = "0" + paddedDate;
          }
      
          let toStoreDate = `${year}-${paddedMonth}-${paddedDate}`;
          console.log("to storing date"+toStoreDate);



          let epaddedMonth = emonth.toString();
          if (epaddedMonth.length < 2) {
            epaddedMonth = "0" + epaddedMonth;
          }
      
          let epaddedDate = edate.toString();
          if (epaddedDate.length < 2) {
            epaddedDate = "0" + epaddedDate;
          }
      
          let etoStoreDate = `${eyear}-${epaddedMonth}-${epaddedDate}`;
          console.log("End to storing date"+etoStoreDate);

          
      
          todoList.forEach(todoObj => {
            if (todoObj.id == id) {
              todoObj.date = toStoreDate;
              todoObj.edate = etoStoreDate;
              if(hour !== 0)
                todoObj.time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                todoObj.etime = `${ehour.toString().padStart(2, "0")}:${eminute.toString().padStart(2, "0")}`;
            }
          });
      
         save();
      
          multipleFilter();
      },
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        hour12: false
      }
    });

    calendar.render();
  }

  function addEvent({id, todo, date, time, edate, etime, done}) {
    calendar.addEvent({
      id: id,
      title: todo,
      start: time === "" ? date : `${date}T${time}`,
      end: etime === "" ? edate : `${edate}T${etime}`,
      backgroundColor : (done ? "green" : "#a11e12"),
    });
  }

  function clearTable() {
    // Empty the table, keeping the first row
    let trElems = todoTable.getElementsByTagName("tr");
    for (let i = trElems.length - 1; i > 0; i--) {
      trElems[i].remove();
    }

    calendar.getEvents().forEach(event => event.remove());
  }

  function multipleFilter() {
    clearTable();

    let selection = selectElem.value;

    if (selection == DEFAULT_OPTION) {

      if (shortlistBtn.checked) {
        let resultArray = [];

        let filteredIncompleteArray = todoList.filter(obj => obj.done == false);
        //renderRows(filteredIncompleteArray);

        let filteredDoneArray = todoList.filter(obj => obj.done == true);
        //renderRows(filteredDoneArray);

        resultArray = [...filteredIncompleteArray, ...filteredDoneArray];
        renderRows(resultArray);
      } else {
        renderRows(todoList);
      }

    } else {

      let filteredCategoryArray = todoList.filter(obj => obj.category == selection);

      if (shortlistBtn.checked) {
        let resultArray = [];

        let filteredIncompleteArray = filteredCategoryArray.filter(obj => obj.done == false);
        //renderRows(filteredIncompleteArray);

        let filteredDoneArray = filteredCategoryArray.filter(obj => obj.done == true);
        //renderRows(filteredDoneArray);

        resultArray = [...filteredIncompleteArray, ...filteredDoneArray];
        renderRows(resultArray);
      } else {
        renderRows(filteredCategoryArray);
      }

    }
    
  }

  function onTableClicked(event) {
    if (event.target.matches("td") && event.target.dataset.editable == "true") {
      let tempInputElem;
      switch (event.target.dataset.type) {
        case "date":
          tempInputElem = document.createElement("input");
          tempInputElem.type = "date";
          tempInputElem.value = event.target.dataset.value;
          break;
        case "time":
          tempInputElem = document.createElement("input");
          tempInputElem.type = "time";
          tempInputElem.value = event.target.innerText;
          break;
        case "End-Date":
          tempInputElem = document.createElement("input");
          tempInputElem.type = "date";
          tempInputElem.value = event.target.dataset.value;
          break;
        case "End-Time":
          tempInputElem = document.createElement("input");
          tempInputElem.type = "time";
          tempInputElem.value = event.target.innerText;
          break;   
        case "todo":
        case "category":
          tempInputElem = document.createElement("input");
          tempInputElem.value = event.target.innerText;

          break;
        default:
      }
      event.target.innerText = "";
      event.target.appendChild(tempInputElem);

      tempInputElem.addEventListener("change", onChange, false);


    }

    function onChange(event) {
      let changedValue = event.target.value;
      let id = event.target.parentNode.dataset.id;
      let type = event.target.parentNode.dataset.type;

      // remove from calendar
      calendar.getEventById(id).remove();

      todoList.forEach(todoObj => {
        if (todoObj.id == id) {
          //todoObj.todo = changedValue;
          todoObj[type] = changedValue;

          addEvent({
            id: id,
            title: todoObj.todo,
            start: todoObj.date,
            end:todoObj.edate
          });
        }
      });
      save();

      if (type == "date") {
        event.target.parentNode.innerText = formatDate(changedValue);
      } else {
        event.target.parentNode.innerText = changedValue;
      }

    }
  }

  function formatDate(date) {
    let dateObj = new Date(date);
    console.log(dateObj);
    let formattedDate = dateObj.toLocaleString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  }

  function showEditModalBox(event) {
    document.getElementById("todo-overlay").classList.add("slidedIntoView");
  }

  function closeEditModalBox(event) {
    document.getElementById("todo-overlay").classList.remove("slidedIntoView");
  }

  function commitEdit(event) {
    closeEditModalBox();

    let id = event.target.dataset.id;
    let todo = document.getElementById("todo-edit-todo").value;
    let category = document.getElementById("todo-edit-category").value;
    let date = document.getElementById("todo-edit-date").value;
    let time = document.getElementById("todo-edit-time").value;
     let edate = document.getElementById("todo-edit-edate").value;
    let etime = document.getElementById("todo-edit-etime").value;

    // remove from calendar
    calendar.getEventById(id).remove();

    for (let i = 0; i < todoList.length; i++) {
      if (todoList[i].id == id) {
        todoList[i] = {
          id: id,
          todo: todo,
          category: category,
          date: date,
          time: time,
          edate:edate,
          etime:etime,
          done: false,
        };

        addEvent(todoList[i]);
      }
    }

    save();

    // Update the table
    //let tdNodeList = todoTable.querySelectorAll("td");
    //let tdNodeList = todoTable.querySelectorAll("td[data-id='" + id + "']");
    let tdNodeList = todoTable.querySelectorAll(`td[data-id='${id}']`);
    for (let i = 0; i < tdNodeList.length; i++) {
      //if(tdNodeList[i].dataset.id == id){
      let id = tdNodeList[i].dataset.id;
      switch (id) {
        case "todo-edit-date":
          tdNodeList[i].innerText = formatDate(date);
          break;
        case "todo-edit-time":
          tdNodeList[i].innerText = time;
          break;
        case "todo-edit-todo":
          tdNodeList[i].innerText = todo;
          break;
        case "todo-edit-category":
          tdNodeList[i].innerText = category;
          break;
        case "todo-edit-etime":
          tdNodeList[i].innerText = etime;
          break; 
        case "todo-edit-edate":
          tdNodeList[i].innerText = formatDate(edate);
          break;   
      }
      //}
    }
  }

  function toEditItem(event) {
    showEditModalBox();

    let id;

    if (event.target) // mouse event
      id = event.target.dataset.id;
    else // calendar event
      id = event.id;

    preFillEditForm(id);
  }

  function preFillEditForm(id) {
    let result = todoList.find(todoObj => todoObj.id == id);
    let { todo, category, date, time ,edate, etime} = result;

    document.getElementById("todo-edit-todo").value = todo;
    document.getElementById("todo-edit-category").value = category;
    document.getElementById("todo-edit-date").value = date;
    document.getElementById("todo-edit-time").value = time;
    document.getElementById("todo-edit-edate").value = edate;
    document.getElementById("todo-edit-etime").value = etime;
    changeBtn.dataset.id = id;
  }

  function onDragstart(event) {
    event.moveDates(delta);
    draggingElement = event.target; //trElem
  }

  function onDrop(event) {




    if (event.target.matches("table"))
      return;

    let beforeTarget = event.target;


    while (!beforeTarget.matches("tr"))
      beforeTarget = beforeTarget.parentNode;

    if (beforeTarget.matches(":first-child"))
      return;


    todoTable.insertBefore(draggingElement, beforeTarget);



    let tempIndex;


    todoList.forEach((todoObj, index) => {
      if (todoObj.id == draggingElement.dataset.id)
        tempIndex = index;
    });


    let [toInsertObj] = todoList.splice(tempIndex, 1);



    todoList.forEach((todoObj, index) => {
      if (todoObj.id == beforeTarget.dataset.id)
        tempIndex = index;
    });


    todoList.splice(tempIndex, 0, toInsertObj);


    save();

  }

  function onDragover(event) {
    event.moveEnd(delta );
  }

  function calendarEventDragged(event) {
    let id = event.id;

    let dateObj = new Date(event.start);
    console.log("dateobj "+ dateObj)
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();
    let hour = dateObj.getHours();
    let minute = dateObj.getMinutes();

    let paddedMonth = month.toString();
    if (paddedMonth.length < 2) {
      paddedMonth = "0" + paddedMonth;
    }

    let paddedDate = date.toString();
    if (paddedDate.length < 2) {
      paddedDate = "0" + paddedDate;
    }

    let toStoreDate = `${year}-${paddedMonth}-${paddedDate}`;
    console.log("to storing date"+toStoreDate);

    todoList.forEach(todoObj => {
      if (todoObj.id == id) {
        todoObj.date = toStoreDate;
        if(hour !== 0)
          todoObj.time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      }
    });

    save();

    multipleFilter();

  }

  function onPaginationBtnsClick(event){
    switch(event.target.dataset.pagination){
      case "pageNumber" :
        currentPage = Number(event.target.innerText);
        break;
      case "previousPage" :
        currentPage = currentPage == 1 ? currentPage : currentPage - 1;
        break;
      case "nextPage" :
        currentPage = currentPage == totalPages ? currentPage : currentPage + 1;
        break;
      case "firstPage" :
        currentPage = 1;
        break;
      case "lastPage" :
        currentPage = totalPages;
        break;
      default:
    }
    multipleFilter();
  }

  function renderPageNumbers(arr){
    let numberOfItems = arr.length;
    totalPages = Math.ceil(numberOfItems / itemsPerPage);
    
    let pageNumberDiv = document.querySelector(".pagination-pages");

    pageNumberDiv.innerHTML = `<span class="material-icons chevron" data-pagination="firstPage">first_page</span>`;
    
    if(currentPage != 1)
      pageNumberDiv.innerHTML += `<span class="material-icons chevron" data-pagination="previousPage">chevron_left</span>`;

    if(totalPages > 0){
      for(let i = 1; i <= totalPages; i++) {
        pageNumberDiv.innerHTML += `<span data-pagination="pageNumber">${i}</span>`;
      }
    }
    
    if(currentPage != totalPages)
      pageNumberDiv.innerHTML += `<span class="material-icons chevron" data-pagination="nextPage">chevron_right</span>`;

      pageNumberDiv.innerHTML += `<span class="material-icons chevron" data-pagination="lastPage">last_page</span>`;
  }

  function selectItemsPerPage(event){
    itemsPerPage = Number(event.target.value);
    localStorage.setItem("todo-itemsPerPage", itemsPerPage);
    multipleFilter();

  }
}
