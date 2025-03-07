async function buscarPeba() {
    const url = "https://dog.ceo/api/breeds/image/random";
  
    try {
      const response = await fetch(url);
  
      // Verificação de sucesso na resposta
      if (!response.ok) {
        throw new Error("Erro ao buscar a imagem");
      }
      
      const data = await response.json();
      
      // Verifica se o link da imagem existe na resposta
      if (!data.message) {
        throw new Error("Imagem não encontrada");
      }
  
      // Exibe a imagem do cão na página

      const img = document.getElementById('pic_peba')
      img.src = data.message
      

    } catch (error) {
      document.getElementById("ver_peba").innerHTML = `
        <p style="color: red;">${error.message}</p>
      `;
    }
  }


const show_section = document.querySelector('#bttn_show_add_peba')

show_section.addEventListener('click', ()=>{
  const x = document.querySelector('#add_peba')
  x.style.display = 'block'
})
