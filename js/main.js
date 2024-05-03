//유저가 값을 입력한다.
// + 버튼을 클릭하면, 할일이 추가된다.
// delete 버튼을 누르면 할일이 삭제된다.
//check 버튼을 누르면 할일이 끝나면서 밑줄이간다.
//1. check 버튼을 클릭하는 순간 true false
//2. true이면 끝난걸로 간주하고 밑줄 보여주기
//3. false이면 안끝난걸로 간주하고 그대로
// 진행중 끝남 탭을 누르면, 언더바가 이동한다.
//끝남탭은, 끝난 아이템만, 진행중탭은 진행중인 아이템만
// 전체탭을 누르면 다시 전체 아이템으로 돌아옴

let taskBoard = document.getElementById("task-board");
let taskInput = document.getElementById("task-input");
//console.log(teskInput);
let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".task-tabs div");
let underLine = document.getElementById("under-line");
let taskList = [];
let mode = "all";
let filterList =[];
let task =[];

let savedTodoList = JSON.parse(localStorage.getItem('saved-items'));
//console.log("localStorage",savedTodoList);

//if(savedTodoList){} 여기서부터 작업하기
if(savedTodoList){
    for(let i=0;i<savedTodoList.length;i++){
        addTask(savedTodoList[i]);
    }
}

// 버튼 클릭이벤트 따로 분리하기
//addButton.addEventListener("click",addTask);
addButton.addEventListener('click', ()=>{
    if(taskInput.value !==''){
        addTask();
    }else{
        alert("할일을 입력하세요!");
    }

});

taskInput.addEventListener("keydown",function(event){
    if(event.keyCode === 13){
        //addTask(event);
        if(taskInput.value !==''){
            addTask();
        }else{
            alert("할일을 입력하세요!");
        }
    
    }
});


for(let i=1;i<tabs.length;i++){
    tabs[i].addEventListener("click",function(event){
        filter(event);
        console.log("이벤트", mode)
    });
}

function addTask(storageData) {
    //console.log("clicked")
    let taskValue = taskInput.value;
    
    if(storageData) {
        taskValue = storageData.taskContent;
         task = {
            id:storageData.id,
            //taskContent : taskInput.value,
            taskContent : taskValue,
    
            isComplete:storageData.isComplete
        }  
    }else{
        task = {
            id:randomIDGenerate(),
            //taskContent : taskInput.value,
            taskContent : taskValue,
    
            isComplete:false
        }  
    }

    //if(taskValue === "") return alert("할일을 입력하세요!");
    
   

    taskList.push(task);
   // console.log(JSON.stringify(taskList));//문자열로 변환
   
    localStorage.setItem('saved-items',JSON.stringify(taskList));
    //console.log("taskList",taskList);
    taskInput.value="";
    render()
}

function render(){
    //1. 내가 선택한 탭에 따라서
    let list=[];
    if(mode === "all"){
        //all taskList
        list = taskList;
    }else if(mode ==="ongoing" || mode === "done"){
        //ongoing, done filterList
        list = filterList;
    }
    
    //2. 리스트를 달리 보여준다.
    //all taskList
    //ongoing, done filterList
    let resultHTML = '';
    for(let i=0;i<list.length;i++){
        if(list[i].isComplete == true) {
            resultHTML += `<div class="tesk">
            <div class="task-done">${i+1}. ${list[i].taskContent}</div>
            <div>
                <button onclick="toggleComplete('${list[i].id}')" class="chk_btn checked"></button>
                <button onclick="deleteTask('${list[i].id}')" class="del_btn"></button>
            </div>
        </div>`;
        }else{

            resultHTML += `<div class="tesk">
            <div>${i+1}. ${list[i].taskContent}</div>
            <div>
                <button onclick="toggleComplete('${list[i].id}')" class="chk_btn"></button>
                <button onclick="deleteTask('${list[i].id}')" class="del_btn"></button>
            </div>
        </div>`;
        }
    }

    //원래 강의 소스, 마지막에 뿌려줌
    taskBoard.innerHTML = resultHTML;

   

}

function toggleComplete(id){
   // console.log("id:",id);
  
    if(savedTodoList){       
        for(let i=0;i<savedTodoList.length;i++){           
            //console.log("localStorage",savedTodoList[i].id);
            if(savedTodoList[i].id === id){
                console.log("id",savedTodoList[i].id);                
                savedTodoList[i].isComplete = !savedTodoList[i].isComplete;    
                console.log("isComplete",savedTodoList[i].isComplete); 
                break;
            }
         
        }
    }

    for(let i=0;i<taskList.length;i++){
            if(taskList[i].id === id) {
                taskList[i].isComplete = !taskList[i].isComplete;           
                break;
            }
        }  
       
    localStorage.setItem('saved-items',JSON.stringify(taskList));
   
    filter()
   
}

function deleteTask(id) {
    //console.log("삭제하자", id);
    if(savedTodoList){       
        for(let i=0;i<savedTodoList.length;i++){           
            //console.log("localStorage",savedTodoList[i].id);
            if(savedTodoList[i].id === id){
                savedTodoList.splice(i,1)
                break;
            }
         
        }
    }
    for(let i=0; i<taskList.length;i++){
        if(taskList[i].id === id){
            taskList.splice(i,1)
            break;
        }
    }

    if(savedTodoList.length === 0){
        localStorage.removeItem('saved-items')
    }else{
        // console.log(JSON.stringify(saveItems));//문자열로 변환
        localStorage.setItem('saved-items',JSON.stringify(taskList));
    }
    
    
    filter();
}

function filter(event){
    //어떤 탭을 클릭했는지 분별
    //console.log(filter,event.target.id);
    if(event){
        mode = event.target.id;
        underLine.style.width = event.target.offsetWidth + "px";
        underLine.style.left = event.target.offsetLeft + "px";        
        underLine.style.top =
        event.target.offsetTop + (event.target.offsetHeight - 4) + "px";

        // console.log(underLine.style.top);
    }
    
    filterList =[];
    if(mode === "all") {
        //전체 리스트를 보여준다.
        render()
    }else if(mode === "ongoing") {
        //진행중인 아이템을 보여준다.
        //task.isComplete=false
        for(let i=0;i<taskList.length;i++){
            if(taskList[i].isComplete === false) {
                filterList.push(taskList[i])
                
            }           
        }
        render()
        //console.log("진행중",filterList);
    }else if(mode === "done"){
        //끝나는 리스트
        for(let i=0;i<taskList.length;i++){
            if(taskList[i].isComplete === true) {
                filterList.push(taskList[i])
            }           
        }
         render()
        //console.log("끝남",filterList);
    }
}

function randomIDGenerate(){
    return '_' + Math.random().toString(36).substr(2, 9);
}

