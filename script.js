// Lista de produtos da loja
const products = [
    {
        id: 1,
        name: "Capacete Pro Tork",
        price: 199.90,
        image: "img/capacete.jpg"
    },
    {
        id: 2,
        name: "Luva Pro Tork",
        price: 59.90,
        image: "img/luva.jpg"
    },
    {
        id: 3,
        name: "Mini Moto a Gasolina",
        price: 2499.90,
        image: "img/minimoto.jpg"
    },
    {
        id: 4,
        name: "Bicicleta",
        price: 899.90,
        image: "img/bicicleta.jpg"
    }
];

// Cria um carrinho vazio
let cart = [];

// Exibe os produtos na página
function renderProducts() {

    // Localiza a área dos produtos
    const list = document.getElementById("product-list");

    // Cria os cartões de produtos
    list.innerHTML = products.map(product => `

        <div class="product">

            <img src="${product.image}" alt="${product.name}">

            <div class="product-info">

                <h3>${product.name}</h3>

                <div class="price">
                    R$ ${product.price.toFixed(2).replace(".", ",")}
                </div>

                <button onclick="addToCart(${product.id})">
                    ADICIONAR AO CARRINHO
                </button>

            </div>

        </div>

    `).join("");

}

// Adiciona produtos ao carrinho
function addToCart(id) {

    // Procura o produto pelo identificador
    const product = products.find(p => p.id === id);

    // Adiciona o produto ao carrinho
    cart.push(product);

    // Atualiza as informações
    updateCart();

}

// Atualiza o carrinho
function updateCart() {

    // Atualiza a quantidade de produtos
    document.getElementById("count").textContent = cart.length;

    // Localiza a lista de itens
    const items = document.getElementById("cart-items");

    // Exibe os produtos adicionados
    items.innerHTML = cart.map((item, index) => `

        <div class="cart-item">

            ${item.name} -

            R$ ${item.price.toFixed(2).replace(".", ",")}

            <button onclick="removeItem(${index})">
                Remover
            </button>

        </div>

    `).join("");

    // Soma os preços
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    // Mostra o valor total
    document.getElementById("total").textContent =
        total.toFixed(2).replace(".", ",");

}

// Remove um produto do carrinho
function removeItem(index) {

    // Remove o item selecionado
    cart.splice(index, 1);

    // Atualiza o carrinho
    updateCart();

}

// Abre ou fecha o carrinho
function toggleCart() {

    // Localiza o painel
    const panel = document.getElementById("cart-panel");

    // Alterna entre mostrar e esconder
    panel.style.display =
        panel.style.display === "block" ? "none" : "block";

    // Desloca a página até o carrinho
    panel.scrollIntoView({ behavior: "smooth" });

}

// Finaliza o pedido
async function checkout() {

    // Verifica se o carrinho está vazio
    if (cart.length === 0) {

        // Mostra um aviso
        alert("Seu carrinho está vazio!");

        // Interrompe a função
        return;

    }

    try {

        // Envia os produtos para o PHP
      const response = await fetch("finalizar.php", {

            method: "POST", // Define o método de envio

            headers: {
                "Content-Type": "application/json" // Define o formato dos dados
            },

            body: JSON.stringify({

                // Envia apenas identificadores e quantidades
                items: cart.map(item => ({
                    id: item.id,
                    quantity: 1
                }))

            })

        });

        // Converte a resposta do PHP para JSON
        const result = await response.json();

        // Verifica se o pedido foi processado
        if (!response.ok || !result.success) {

            throw new Error(result.message || "Não foi possível finalizar o pedido.");

        }

        // Abre o WhatsApp com a mensagem gerada pelo PHP
        window.open(result.whatsappUrl, "_blank");

    } catch (error) {

        // Mostra uma mensagem em caso de erro
        alert(error.message);

    }

}

// Executa a exibição dos produtos ao abrir o site
renderProducts();
alert("Novo script carregado!");