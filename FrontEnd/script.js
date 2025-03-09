const formatId = (id) => `#${id.toString().padStart(5, '0')}`;
let prisonerIDtoEdit = null
let prisonerIDtoDelete = null

const fotos = [
    "Imagens/musk.jpg",
    "Imagens/putin.jpg",
    "Imagens/sai.jpg",
    "Imagens/shinji.jpg",
    "Imagens/shinjo.jpg",
    "Imagens/tama.jpg",
    "Imagens/tiro.jpg",
    "Imagens/white.jpg",
    "Imagens/boso.jpg",
    "Imagens/bozo.jpg",
    "Imagens/cebola.jpg",
    "Imagens/crews.jpg",
    "Imagens/diddy.jpg",
    "Imagens/dog.jpg",
    "Imagens/dolly.jpg",
    "Imagens/douglas.jpg",
    "Imagens/foto.jpg",
    "Imagens/frogo.jpg",
    "Imagens/gustavo.jpg",
    "Imagens/kim.jpg",
    "Imagens/liodas.jpg",
    "Imagens/lovin.jpg",
    "Imagens/malfeitores/pod.jpg",
    "Imagens/malfeitores/timote.jpg",
    "Imagens/malfeitores/alexdeniteroi.jpg",
    "Imagens/malfeitores/caim.jpg",
    "Imagens/malfeitores/danielmolo.jpg",
    "Imagens/malfeitores/eanasir.jpg",
    "Imagens/malfeitores/gilflamenguista.jpg",
    "Imagens/malfeitores/grifi.jpg",
    "Imagens/malfeitores/magomed.jpg",
    "Imagens/malfeitores/manga.jpg",
    "Imagens/malfeitores/mc.jpg",
    "Imagens/malfeitores/pah.jpg",
]

async function renderprisoners (){
    try {
        const resposta = await fetch('http://127.0.0.1:8000/presos')
        if(!resposta.ok){
            throw new Error('Erro ao carregar prisioneiros da API')
        }

        const data = await resposta.json();
        console.log(data)

        const prisoners = data.Presos;

        prisoners.sort((a, b) => a.id - b.id);


        const prisonergrid = document.getElementById("prisonerGrid")
        prisonergrid.innerHTML = ''

        
        prisoners.forEach(preso => {
            const card = document.createElement('div')
            card.classList.add('prisoner-card');

            const randomimg = fotos[Math.floor(Math.random() * fotos.length)];

            card.innerHTML = `
                <img src="${randomimg}" alt="Foto">
                <div class="prisoner-info">
                    <h3>${preso.nome} - ID: ${preso.id}</h3>
                    <p>Identificação: ${formatId(preso.id)  }</p>
                    <p>Crimes: ${preso.crime}</p>
                </div>
                
                <div class="actions">
                    <button class="edit-btn" data-id="${preso.id}">Editar</button>
                    <button class="delete-btn" data-id="${preso.id}">Excluir</button>
                </div>
            `
            
            prisonergrid.appendChild(card)
        });
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (event) => {

                prisonerIDtoEdit = event.target.getAttribute('data-id');
                console.log('ID do prisioneiro a ser editado:', prisonerIDtoEdit);
                updatePrisoner();
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {

                prisonerIDtoDelete = event.target.getAttribute('data-id');
                console.log('ID do prisioneiro a ser deletado:', prisonerIDtoDelete);
                deletePrisoner()
            });
        });
        

    } catch (erro) {
        console.error(erro);
        alert('Ocorreu um erro ao carregar os prisioneiros')
    }
    
}

const addbtn = document.getElementById('loadprisoners')

addbtn.addEventListener('click', ()=>{
    renderprisoners()
})


async function addPrisoner (){
    const nome = document.getElementById('name').value
    const nascimento = document.getElementById('idade').value
    const genero = document.getElementById('genero').value
    const crime = document.getElementById('crime').value
    const pena = document.getElementById('pena').value
    const estado = document.getElementById('estado').value

    if (!nome || !nascimento || !genero || !crime || !pena || !estado){
        alert('Preencha todos os campos"')
        return;
    }

    try {
        const resposta = await fetch('http://127.0.0.1:8000/preso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: nome,
                datanacs: nascimento,
                sexo: genero,
                crime: crime,
                tempopena: pena, 
                estado: estado
            }),
        })

        if (!resposta.ok){
            throw new Error('Erro ao criar prisioneiro.')
        }

        alert('Prisioneiro criado com sucesso.')

        document.getElementById('name').value = '';
        document.getElementById('idade').value = '';
        document.getElementById('genero').value = '';
        document.getElementById('crime').value = '';
        document.getElementById('pena').value = '';
        document.getElementById('estado').value = '';
        
        renderprisoners()
        
    } catch (erro) {
        console.error(erro)
        alert("Erro ao criar o prisioneiro.")
    }
}



const editPrisonerContainer = document.getElementById('edit-prisoner-container')

async function updatePrisoner() {
    const prisonerID = prisonerIDtoEdit 
    
    try {
        const resposta = await fetch(`http://127.0.0.1:8000/preso/${prisonerID}`)

        if (!resposta.ok){
            throw new Error('Erro ao carregar prisioneiro da API.')
        }
    
        const dados = await resposta.json()
        
        preso = dados.Preso[0]

        editPrisonerContainer.innerHTML = `
            <p>Nome: ${preso.nome} - ID: ${preso.id}</p>    
            <input type="text" id="updatedcrime" placeholder="Crime" maxlength="30">
            <input type="number" id="updatedpena" placeholder="Pena (Em Anos)" min="1">
            <select id="updatedestado" aria-placeholder="Já está preso?">
                <option value="" disabled selected>Já está preso?</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
            </select>
            <button class="update-btn" onclick="saveUpdatedPrisoner(${prisonerID})">Salvar alterações</button>
        `
        
        const updatedcrime = document.getElementById('updatedcrime');
        const updatedpena = document.getElementById('updatedpena');
        const updatedestado = document.getElementById('updatedestado');
        
        updatedcrime.value = preso.crime
        updatedpena.value = preso.pena
        updatedestado.value = preso.estado ? 'true' : 'false';
        
        editPrisonerContainer.style.display = 'block'

    } catch (erro) {
        console.error(erro)
        alert('Erro ao carregar o prisioneiro a ser editado.')
        
    }

}

async function saveUpdatedPrisoner(prisonerID){
    const updatedcrime = document.getElementById('updatedcrime').value;
    const updatedpena = document.getElementById('updatedpena').value;
    const updatedestado = document.getElementById('updatedestado').value;

    if (!updatedcrime || !updatedpena || !updatedestado) {
        alert('Preencha todos os campos!');
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:8000/preso/${prisonerID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                crime: updatedcrime,
                tempopena: updatedpena, 
                estado: updatedestado
            }),
        });

        if (!resposta.ok) {
            throw new Error('Erro ao atualizar ator');
        }

        alert('Ator atualizado com sucesso!');
        editPrisonerContainer.innerHTML = '';  
        editPrisonerContainer.style.display = 'none';
        renderprisoners()
    } catch (erro) {
        console.error(erro);
        alert('Ocorreu um erro ao atualizar o ator.');
    }
}

async function deletePrisoner() {
    const prisonerID = prisonerIDtoDelete
    
    const confirm = window.confirm('Tem certeza que deseja excluir este prisioneiro?');

    if (confirm) {
        try {
            const resposta = await fetch(`http://127.0.0.1:8000/preso/${prisonerID}`, {
                method: 'DELETE',
            });

            if (!resposta.ok) {
                throw new Error('Erro ao excluir prisioneiro.');
            }

            alert('Prisioneiro excluído com sucesso!');
            renderprisoners();
        } catch (erro) {
            console.error(erro);
            alert('Erro ao excluir o prisioneiro.');
        }
    } else {
        console.log('Ação de exclusão cancelada.');
    }
}

