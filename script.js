// Selecionando elementos
const addBtn = document.querySelector(".addBtn");
const addModal = document.querySelector(".cttAdd");
const sairAddBtn = document.querySelector(".sairAdd");
const saveAddBtn = document.querySelector(".saveAdd");
const perfilInput = document.querySelector(".perfilAdd");
const perfilPreview = document.querySelector(".perfilPreviewAdd");
const nomeInput = document.querySelector(".nomeAdd");
const numInput = document.querySelector(".numAdd");
const localInput = document.querySelector(".localAdd");
const descInput = document.querySelector(".descAdd");
const mainContainer = document.querySelector("main");

// Carregar contatos salvos ao carregar a página
document.addEventListener("DOMContentLoaded", loadContacts);

// Função para abrir modal de adição
addBtn.addEventListener("click", () => {
    addModal.style.display = "flex";
});

// Fechar modal de adição
sairAddBtn.addEventListener("click", () => {
    addModal.style.display = "none";
    resetAddModal();
});

// Pré-visualizar imagem do perfil
perfilInput.addEventListener("change", () => {
    const file = perfilInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            perfilPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Limitar caracteres nos campos de adição
nomeInput.maxLength = 20;
localInput.maxLength = 20;
descInput.maxLength = 20;
numInput.maxLength = 15;

// Formatar o número no campo de adição
numInput.addEventListener("input", (event) => {
    let num = event.target.value.replace(/\D/g, "");
    if (num.length > 11) num = num.slice(0, 11);

    if (num.length >= 7) {
        num = `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
    } else if (num.length >= 2) {
        num = `(${num.slice(0, 2)}) ${num.slice(2)}`;
    } else if (num.length > 0) {
        num = `(${num}`;
    }

    event.target.value = num;
});

// Salvar novo contato
saveAddBtn.addEventListener("click", () => {
    const nome = nomeInput.value.trim();
    const numero = numInput.value.trim();
    const local = localInput.value.trim();
    const descricao = descInput.value.trim();

    if (!nome || !numero || !local || !descricao) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    addContact(nome, numero, local, descricao, perfilPreview.src);
    saveContactsToLocal();
    addModal.style.display = "none";
    alert("Novo contato adicionado com sucesso!");
    resetAddModal();
});

// Função para adicionar o contato na ordem alfabética
function addContact(nome, numero, local, descricao, perfilSrc) {
    const letra = nome[0].toUpperCase();
    const classPrefix = isNaN(letra) ? letra : 'num';

    let section = document.querySelector(`.${classPrefix}`);
    if (!section) {
        section = document.createElement("section");
        section.classList.add(classPrefix);
        const title = document.createElement("h4");
        title.classList.add("letter");
        title.textContent = isNaN(letra) ? letra : '0-9';
        section.appendChild(title);
        mainContainer.appendChild(section);
    }

    const contactDiv = document.createElement("div");
    contactDiv.classList.add("ctt");
    contactDiv.innerHTML = `
        <div class="perfilDiv"><img src="${perfilSrc}" alt="" class="perfilCtt"></div>
        <div class="nomeDiv"><h2 class="nomeCtt">${nome}</h2></div>
    `;

    contactDiv.addEventListener("click", () => {
        showContactDetails(nome, numero, local, descricao, perfilSrc, contactDiv);
    });

    // Inserir o contato na ordem alfabética dentro da seção
    const contacts = Array.from(section.querySelectorAll(".ctt"));
    contacts.push(contactDiv);
    contacts.sort((a, b) => {
        const nameA = a.querySelector(".nomeCtt").textContent.toUpperCase();
        const nameB = b.querySelector(".nomeCtt").textContent.toUpperCase();
        return nameA.localeCompare(nameB);
    });

    // Limpar e reordenar a seção com os contatos
    section.innerHTML = `<h4 class="letter">${isNaN(letra) ? letra : '0-9'}</h4>`;
    contacts.forEach(contact => section.appendChild(contact));
}

// Função para salvar os contatos no localStorage
function saveContactsToLocal() {
    const contactsData = [];
    document.querySelectorAll(".ctt").forEach(contactDiv => {
        const nome = contactDiv.querySelector(".nomeCtt").textContent;
        const numero = contactDiv.querySelector(".numCtt")?.textContent || "";
        const local = contactDiv.querySelector(".localCtt")?.textContent || "";
        const descricao = contactDiv.querySelector(".descCtt")?.textContent || "";
        const perfilSrc = contactDiv.querySelector(".perfilCtt").src;
        contactsData.push({ nome, numero, local, descricao, perfilSrc });
    });
    localStorage.setItem("contacts", JSON.stringify(contactsData));
}

// Função para carregar e organizar os contatos salvos no localStorage
function loadContacts() {
    const contactsData = JSON.parse(localStorage.getItem("contacts")) || [];
    contactsData
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .forEach(contact => {
            addContact(contact.nome, contact.numero, contact.local, contact.descricao, contact.perfilSrc);
        });
}

// Função para resetar o modal de adição
function resetAddModal() {
    perfilPreview.src = "";
    perfilInput.value = "";
    nomeInput.value = "";
    numInput.value = "";
    localInput.value = "";
    descInput.value = "";
}

// Selecionando elementos para detalhes e edição
const detailsModal = document.querySelector(".detailsCtt");
const sairDetailsBtn = document.querySelector(".sairDetails");
const perfilDetails = document.querySelector(".perfilCttDetails");
const nomeDetails = detailsModal.querySelector(".nomeCtt");
const numDetails = detailsModal.querySelector(".numCtt");
const localDetails = detailsModal.querySelector(".localCtt");
const descDetails = detailsModal.querySelector(".descCtt");
const editDetailsBtn = detailsModal.querySelector(".editCtt");

const editModal = document.querySelector(".cttEdit");
const sairEditButton = editModal.querySelector(".sairEdit");
const saveEditButton = editModal.querySelector(".saveEdit");
const nomeEditInput = editModal.querySelector(".nomeEdit");
const numEditInput = editModal.querySelector(".numEdit");
const localEditInput = editModal.querySelector(".localEdit");
const descEditInput = editModal.querySelector(".descEdit");
let contatoAtual = null;

nomeEditInput.maxLength = 20;
localEditInput.maxLength = 20;
descEditInput.maxLength = 20;
numEditInput.maxLength = 15;

numEditInput.addEventListener("input", (event) => {
    let num = event.target.value.replace(/\D/g, "");
    if (num.length > 11) num = num.slice(0, 11);

    let formattedNum = "";
    if (num.length >= 7) {
        formattedNum = `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
    } else if (num.length >= 2) {
        formattedNum = `(${num.slice(0, 2)}) ${num.slice(2)}`;
    } else if (num.length > 0) {
        formattedNum = `(${num}`;
    }

    event.target.value = formattedNum;
});

function showContactDetails(nome, numero, local, descricao, perfilSrc, contactDiv) {
    perfilDetails.src = perfilSrc;
    nomeDetails.textContent = nome;
    numDetails.textContent = numero;
    localDetails.textContent = local;
    descDetails.textContent = descricao;
    contatoAtual = contactDiv;
    detailsModal.style.display = "flex";
}

sairDetailsBtn.addEventListener("click", () => {
    detailsModal.style.display = "none";
});

editDetailsBtn.addEventListener("click", () => {
    nomeEditInput.value = nomeDetails.textContent;
    const numeroSemFormato = numEditInput.value.replace(/\D/g, '');
    numDetails.textContent = `(${numeroSemFormato.slice(0, 2)}) ${numeroSemFormato.slice(2, 7)}-${numeroSemFormato.slice(7)}`;
    localDetails.textContent = localEditInput.value;
    descDetails.textContent = descEditInput.value;

    saveContactsToLocal();
    editModal.style.display = "none";
    alert("Contato editado com sucesso!");
});

sairEditButton.addEventListener("click", () => {
    editModal.style.display = "none";
});
