let user = {name: "", from: "", to: "", text: "", type: "", time: ""};
login();

//funçôes de login

function login (){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(userLogin);
    promise.catch(serverError);
}

function userLogin(){
    user = {name: prompt("Digite o seu nome")};
    user.from = user.name;
    selectcontact(document.querySelector(".contact p"));
    user.type = "message";
    //selectvisibility(document.querySelector(".visibility p"));
    const promiseLogin = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promiseLogin.then(setInterval(getParticipants, 10000));
    promiseLogin.then(setInterval(userStatus, 4000));
    promiseLogin.then(setInterval(getMessages, 3000));
    promiseLogin.catch(userError);
}

function getParticipants(){
    const promisePart = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    //promisePart.then(console.log(promisePart));
    promisePart.then(setParticipants);
}

function setParticipants(part){
    //console.log(part.data);
    document.querySelector(".menu :nth-child(2)").innerHTML = `<div class="select contact"><ion-icon name="people"></ion-icon><p onclick="selectcontact(this)" name="Todos">Todos<ion-icon class="check" name="checkmark-sharp"></ion-icon></p></div>`
    for(let i=0; i<part.data.length; i++){
        document.querySelector(".menu :nth-child(2)").innerHTML += `<div class="select contact"><ion-icon name="people"></ion-icon><p onclick="selectcontact(this)" name="${part.data[i].name}">${part.data[i].name}<ion-icon class="hidden" name="checkmark-sharp"></ion-icon></p></div>`
    }
}

function userStatus(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user);
    console.log("Status: Ok");
}


//funções de mensagem

function getMessages(){
    const promiseGetMens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    //promiseGetMens.then(console.log(promiseGetMens));
    promiseGetMens.then(setMessages);
}

function setMessages(mess){
    //console.log(mess.data);
    const arrmax = mess.data.length;
    let cont = 35;
    let j = arrmax;
    document.querySelector(".conteiner").innerHTML = "";
    while(cont >= 0){
        j--;
        cont--;
    }
    for(let i=j; i<arrmax; i++){
        if(mess.data[i].type === "message"){
            document.querySelector(".conteiner").innerHTML += `<div class="message"><p><light>(${mess.data[i].time})</light> <b>${mess.data[i].from}</b> para <b>${mess.data[i].to}</b>: ${mess.data[i].text}<p></div>`;    
        }else if(mess.data[i].type === "status"){
            document.querySelector(".conteiner").innerHTML += `<div class="message type-status"><p><light>(${mess.data[i].time})</light> <b>${mess.data[i].from}</b> ${mess.data[i].text}<p></div>`;
        }else{
            document.querySelector(".conteiner").innerHTML += `<div class="message type-private"><p><light>(${mess.data[i].time})</light> <b>${mess.data[i].from}</b> para <b>${mess.data[i].to}</b>: ${mess.data[i].text}<p></div>`;
        }
        
    }
    user.time = mess.data[arrmax-1].time;
    document.querySelector (".conteiner > .message:last-child").scrollIntoView();
}


//funçôes de erro

function serverError(error){
    if(error.response.status === 500){
        alert("Não foi possível conectar, o servidor não respondeu a solicitação");
    }
    return;
}

function userError(error){
    if(error.response.status === 400){
        alert("Não foi possível reconhecer o nome de usuário ou já está existente na sala");
        userLogin();
    }else if(error.response.status === 422){
        alert("Nome de usuário inválido");
        userLogin();
    }
    return;
}


//funcionalidades do layout

function sendMessage(){
    getinput(document.querySelector("input"));
    const promiseSend = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", user);
    const box = document.querySelector(".conteiner");
    if(user.type === "message"){
        box.innerHTML += `<div class="message"><p><light>${user.time}</light> <b>${user.from}</b> para <b>${user.to}</b>: ${user.text}</p></div>`
    } else{
        box.innerHTML += `<div class="message type-private"><p><light>${user.time}</light> <b>${user.from}</b> para <b>${user.to}</b>: ${user.text}</p></div>`
    }
}

function openMenu(){
    const menu = document.querySelector(".participants");
    if(menu.classList.contains("hidden")){
        menu.classList.remove("hidden");
    }else{
        menu.classList.add("hidden");
    }
    //document.querySelector(".contact p ion-icon").classList.toggle("hidden");
}

function getinput(input){
    user.text = input.value;
    input.value = "";
    if(user.text === ""){
        alert("Digite alguma coisa!");
    }
    document.querySelector(".input-box :last-child").classList.remove("hidden");
    if(user.type === "message"){
        document.querySelector(".subtittle").innerHTML = `Enviando para ${user.to} (publicamente)`
    } 
}

function selectcontact(contact){
    if(contact.lastChild.getAttribute("class") === "hidden md hydrated"){
        let uncheck = document.querySelector(".contact .check");
        uncheck.classList.remove("check");
        uncheck.classList.add("hidden");
        contact.lastChild.classList.remove("hidden");
        contact.lastChild.classList.add("check");
        user.to = contact.getAttribute("name");
    }else{
        user.to = "Todos";
    }
}

/*function selectvisibility(visibility){
    if(visibility.lastChild.getAttribute("class") === "hidden md hydrated"){
        let uncheck = document.querySelector(".visibility .check");
        uncheck.classList.remove("check");
        uncheck.classList.add("hidden");
        visibility.lastChild.classList.remove("hidden");
        visibility.lastChild.classList.add("check");
        user.to = visibility.getAttribute("name");
    }else{
        user.to = "message";
    }
}*/