
<?php

// Define que a resposta será enviada no formato JSON.
header("Content-Type: application/json; charset=UTF-8");

// Permite somente requisições POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    // Retorna erro para outros métodos.
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método não permitido."
    ]);

    exit;

}

// Lê os dados enviados pelo JavaScript.
$input = json_decode(file_get_contents("php://input"), true);

// Verifica se existe uma lista de produtos.
if (!isset($input["items"]) || !is_array($input["items"])) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Pedido inválido."
    ]);

    exit;

}

// Catálogo de produtos oficial do servidor.
// Os preços não são aceitos diretamente do navegador.
$products = [

    1 => [
        "name" => "Produto PROTOK 01",
        "price" => 89.90
    ],

    2 => [
        "name" => "Produto PROTOK 02",
        "price" => 119.90
    ],

    3 => [
        "name" => "Produto PROTOK 03",
        "price" => 149.90
    ],

    4 => [
        "name" => "Produto PROTOK 04",
        "price" => 69.90
    ]

];

// Inicializa a lista de pedidos.
$order = [];

// Inicializa o valor total.
$total = 0;

// Verifica cada item enviado.
foreach ($input["items"] as $item) {

    // Obtém o identificador do produto.
    $id = filter_var($item["id"] ?? null, FILTER_VALIDATE_INT);

    // Obtém a quantidade.
    $quantity = filter_var(
        $item["quantity"] ?? null,
        FILTER_VALIDATE_INT
    );

    // Verifica se o produto existe.
    if (!$id || !isset($products[$id])) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Produto inválido."
        ]);

        exit;

    }

    // Verifica se a quantidade é válida.
    if (!$quantity || $quantity < 1 || $quantity > 20) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Quantidade inválida."
        ]);

        exit;

    }

    // Recupera o produto do catálogo do servidor.
    $product = $products[$id];

    // Calcula o subtotal.
    $subtotal = $product["price"] * $quantity;

    // Adiciona o produto ao pedido.
    $order[] = [
        "name" => $product["name"],
        "quantity" => $quantity,
        "price" => $product["price"],
        "subtotal" => $subtotal
    ];

    // Soma ao valor total.
    $total += $subtotal;

}

// Verifica se o pedido possui produtos.
if (empty($order)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "O pedido está vazio."
    ]);

    exit;

}

// Cria a mensagem do pedido.
$message = "Olá! Quero fazer um pedido na PROTOK:\n\n";

// Adiciona cada produto à mensagem.
foreach ($order as $product) {

    $message .=
        $product["name"] .
        " | Quantidade: " .
        $product["quantity"] .
        " | Subtotal: R$ " .
        number_format($product["subtotal"], 2, ",", ".") .
        "\n";

}

// Adiciona o valor total.
$message .= "\nTotal: R$ " . number_format($total, 2, ",", ".");

// Número de WhatsApp da loja.
// Substitua pelo número verdadeiro, com código do país e DDD.
$whatsapp = "554199593251";

// Monta o endereço do WhatsApp com a mensagem codificada.
$whatsappUrl = "https://wa.me/" .
    $whatsapp .
    "?text=" .
    rawurlencode($message);

// Retorna o resultado para o JavaScript.
echo json_encode([
    "success" => true,
    "message" => "Pedido preparado com sucesso.",
    "whatsappUrl" => $whatsappUrl
]);

?>
