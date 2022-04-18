let user = {name: "", from: "", to: "Todos", text: "", type: "message", time: ""};


//funçôes de login

function inputLogFocus(log){
    log.removeAttribute("value");
    log.addEventListener('keydown', function(e){
        if(e.key === "Enter"){
           user.name = log.value;
           login();
        }
     }, false);
}

function inputLogBlur(log){
    user.name = log.value;
    log.setAttribute("value", "Digite seu nome");
}


function login (){
    if(user.name === ""){
        alert("Digite um nome válido!");
    }else{
        document.querySelector(".login-chat").classList.add("hidden");
        const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
        promise.then(userLogin);
        promise.catch(serverError);
    }   
}

function userLogin(){
    user.from = user.name;
    //user.type = "message";
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
    document.querySelector(".menu :nth-child(2)").innerHTML = `<div class="select contact"><ion-icon name="people"></ion-icon><p onclick="selectcontact(this)" name="Todos">Todos<ion-icon class="hidden" name="checkmark-sharp"></ion-icon></p></div>`
    for(let i=0; i<part.data.length; i++){
        document.querySelector(".menu :nth-child(2)").innerHTML += `<div class="select contact"><ion-icon name="people"></ion-icon><p onclick="selectcontact(this)" name="${part.data[i].name}">${part.data[i].name}<ion-icon class="hidden" name="checkmark-sharp"></ion-icon></p></div>`
    }
}

function userStatus(){
    const promiseStatus = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user);
    promiseStatus.then(console.log("Status: Ok"));
    promiseStatus.catch(messageError);
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
            if(mess.data[i].from === user.name || mess.data[i].to === user.name || mess.data[i].to === "Todos"){
                document.querySelector(".conteiner").innerHTML += `<div class="message type-private"><p><light>(${mess.data[i].time})</light> <b>${mess.data[i].from}</b> para <b>${mess.data[i].to}</b>: ${mess.data[i].text}<p></div>`;
            }else{
                continue;
            }
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

function messageError(){
    alert("Não foi possível enviar, entre novamente");
    window.location.reload();
}


//funcionalidades do layout

function sendMessage(){
    if(user.text === ""){
        alert("Digite alguma coisa!");
        return;
    }
    document.querySelector(".input-box").innerHTML = '<input onfocus="getinputFocus(this)" onblur="getinputBlur(this)" type="text" value="Escreva aqui..."/><div class="subtittle hidden"></div>'
    const promiseSend = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", user);
    promiseSend.then();
    promiseSend.catch(messageError);
    const box = document.querySelector(".conteiner");
    if(user.type === "message"){
        box.innerHTML += `<div class="message"><p>Carregando...</p></div>`
    } else{
        box.innerHTML += `<div class="message type-private"><p>Carregando...</p></div>`
    }
}

function openMenu(){
    const menu = document.querySelector(".participants");
    if(menu.classList.contains("hidden")){
        menu.classList.remove("hidden");
        document.querySelector("body").classList.add("scroll-lock");
    }else{
        menu.classList.add("hidden");
        document.querySelector("body").classList.remove("scroll-lock");
    }
}

function getinputFocus(input){
    input.removeAttribute("value");
    document.querySelector(".input-box :last-child").classList.remove("hidden");
    if(user.type === "message"){
        document.querySelector(".subtittle").innerHTML = `Enviando para ${user.to} (publicamente)`;
    }else{
        document.querySelector(".subtittle").innerHTML = `Enviando para ${user.to} (reservadamente)`;
    }
    input.addEventListener('keydown', function(e){
        if(e.key === "Enter"){
           user.text = input.value;
           sendMessage();
        }
     }, false);
}

function getinputBlur(input){
    user.text = input.value;
    document.querySelector(".input-box :last-child").classList.add("hidden");
    input.setAttribute("value", "Escreva aqui...");
}

function selectcontact(contact){
    if(contact.lastChild.getAttribute("class") === "hidden md hydrated"){
        let uncheck = document.querySelector(".contact .check");
        if(uncheck !== null){
            uncheck.classList.remove("check");
            uncheck.classList.add("hidden");
        }
        contact.lastChild.classList.remove("hidden");
        contact.lastChild.classList.add("check");
        user.to = contact.getAttribute("name");
    }else{
        user.to = contact.getAttribute("name");
    }
}

function selectvisibility(visibility){
    if(visibility.lastChild.getAttribute("class") === "hidden md hydrated" || "md hydrated hidden"){
        let uncheck = document.querySelector(".visibility .check");
        if(uncheck !== null){
            uncheck.classList.remove("check");
            uncheck.classList.add("hidden");
        }
        visibility.lastChild.classList.remove("hidden");
        visibility.lastChild.classList.add("check");
        user.type = visibility.getAttribute("name");
        console.log(user.type);
    }else{
        user.type = visibility.getAttribute("name");
    }
}