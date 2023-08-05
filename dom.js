window.addEventListener('DOMContentLoaded', init);

function init(){
    let create_sample_button = document.querySelector("#create_sample");
    create_sample_button.addEventListener("click", createSample);    
    let load_local_button = document.querySelector("#load_local");
    load_local_button.addEventListener("click", loadLocal);
    let load_remote_button = document.querySelector("#load_remote");
    load_remote_button.addEventListener("click", loadRemote);
    let save_local_button = document.querySelector("#save_local");
    save_local_button.addEventListener("click", saveLocal);    
}

class ProjectCard extends HTMLElement {
    constructor() {
        super();

        let card_shadow = this.attachShadow({ mode: "open" });

        let card_style = document.createElement("style");

        card_style.textContent = `
            :host {
                display: grid;
                grid-template-columns: 180px auto;
                grid-template-rows: auto auto 25px;
                grid-template-areas: 
                    "title title"
                    "IMG message"
                    "IMG link"
                ;

                border-width: 10px;
                border-color: #60d394;
                border-style: solid;

                width: 400px;
                
                margin: 20px;
            }
    
            h2 {
                grid-area: title;
                text-align: center;

                border-bottom-width: 10px;
                border-bottom-color: #60d394;
                border-bottom-style: solid;

                font-family: var(--cardFontFamily);
            }
    
            img {
                grid-area: IMG;

                width: 100%;
                margin-bottom: 20px;
            }

            p {
                grid-area: message;
                font-family: var(--cardFontFamily);

                padding-left: 10px;
                padding-right: 10px;
            }

            a{
                grid-area: link;
                justify-self: end;
                padding-right: 10px;
            }    
        `   
        card_shadow.appendChild(card_style);
    }
}

customElements.define("project-card", ProjectCard);

class storedCard {
    constructor(card_h2, card_img_src, card_p, card_a){
        this.card_h2 = card_h2;
        this.card_img_src = card_img_src;
        this.card_p = card_p;
        this.card_a = card_a;
    }
}

function createSample() {
    let new_card = document.createElement("project-card");

    let card_shadow = new_card.shadowRoot;

    let card_h2 = document.createElement("h2");
    let card_img = document.createElement("img");
    let card_p = document.createElement("p");
    let card_a = document.createElement("a");

    card_h2.textContent = "New Card";
    card_img.src = "Card_IMG_2.webp";
    card_p.textContent = "No Content yet ffffffffffffffff";
    card_a.textContent = "https://www.google.com";
    card_a.href = "https://www.google.com";

    card_shadow.appendChild(card_h2);
    card_shadow.appendChild(card_img);
    card_shadow.appendChild(card_p);
    card_shadow.appendChild(card_a);

    let main_element = document.querySelector("main");
    main_element.appendChild(new_card);
}

function saveLocal(){
    let storedCardList = [];
    let cards = document.querySelectorAll("project-card");
    for (let card of cards){
        let card_h2 = card.shadowRoot.querySelector("h2").textContent;
        let card_img_src = img_save_process(card.shadowRoot.querySelector("img"));
        let card_p = card.shadowRoot.querySelector("p").textContent;
        let card_a = card.shadowRoot.querySelector("a").href;
        
        storedCardList.push(new storedCard(card_h2, card_img_src, card_p, card_a));
    }
    localStorage.setItem("card_lists", JSON.stringify(storedCardList));
}

function loadLocal(){
    let storedCardList = JSON.parse(localStorage.getItem("card_lists"));
    console.log(storedCardList);

    for (let storedCard of storedCardList){
        let new_card = document.createElement("project-card");
        let card_shadow = new_card.shadowRoot;

        let card_h2 = document.createElement("h2");
        let card_img = document.createElement("img");
        
        let card_p = document.createElement("p");
        let card_a = document.createElement("a");

        card_h2.textContent = storedCard.card_h2;
        card_img.src = storedCard.card_img_src;
        card_p.textContent = storedCard.card_p;
        card_a.href = storedCard.card_a;
        card_a.textContent = storedCard.card_a;

        card_shadow.appendChild(card_h2);
        card_shadow.appendChild(card_img);
        card_shadow.appendChild(card_p);
        card_shadow.appendChild(card_a);

        let main_element = document.querySelector("main");
        main_element.appendChild(new_card);
    }
}

function img_save_process(imgNode){
    let imgCanvas = document.createElement("canvas");
    let imgContext = imgCanvas.getContext("2d");

    imgCanvas.width = imgNode.width;
    imgCanvas.height = imgNode.height;

    imgContext.drawImage(imgNode, 0, 0, imgNode.width, imgNode.height);

    return imgCanvas.toDataURL("image/webp");
}

function loadRemote(){
    let req = new XMLHttpRequest();
    req.addEventListener("load", function(){reqListener(req);});
    req.open("GET", "https://api.unsplash.com/photos/random?client_id=xCu73X652u-tiy94zcavupCw5QBVGgYwjXx6eWI36AA");
    req.send();
}

function reqListener(req){
    if (req.readyState == 4 && req.status == 200){
        let img_data = JSON.parse(req.responseText);

        let new_card = document.createElement("project-card");

        let card_shadow = new_card.shadowRoot;
    
        let card_h2 = document.createElement("h2");
        let card_img = document.createElement("img");
        let card_p = document.createElement("p");
        let card_a = document.createElement("a");
    
        card_h2.textContent = "New Card";
        card_img.src = img_data.urls.thumb;
        card_img.setAttribute("crossorigin", "anonymous");
        card_p.textContent = "No Content yet ffffffffffffffff";
        card_a.textContent = "https://www.google.com";
        card_a.href = "https://www.google.com";
    
        card_shadow.appendChild(card_h2);
        card_shadow.appendChild(card_img);
        card_shadow.appendChild(card_p);
        card_shadow.appendChild(card_a);
    
        let main_element = document.querySelector("main");
        main_element.appendChild(new_card);        
    }
    else{
        console.log(req.status);
    }
}