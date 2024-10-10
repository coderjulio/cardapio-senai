
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

const cart = []

cartBtn.addEventListener("click", () => {
    updateCartModal()
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", (e) => {
    //console.log(e)
    if(e.target == cartModal) {cartModal.style.display = "none"};
})

closeModalBtn.addEventListener("click", (e) => {
    cartModal.style.display = "none";
})

menu.addEventListener("click", (e) => {
    let parentBtn = e.target.closest(".add-to-cart-btn")
    //console.log(parentBtn)
    if(parentBtn) {
        const name = parentBtn.getAttribute("data-name")
        const price = parseFloat(parentBtn.getAttribute("data-price"))

       addToCart(name, price)
    }
})

const addToCart = (name, price) => {
    const existingItem = cart.find(item => item.name === name)
    if(existingItem) {
        existingItem.qtd += 1
    } else {
        cart.push({
            name,
            price,
            qtd: 1,
        })
    }

    updateCartModal()
}

const updateCartModal = () =>{
    cartItemsContainer.innerHTML = ""
    let total = 0
    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-betweenn", "mb-3", "flex-col")
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Quantidade: ${item.qtd}</p>
                    <p class="font-medium mt-2">R$${item.price.toFixed(2)}</p>
                </div>
                <div>
                    <button class="remove-btn" data-name="${item.name}">Remover</button>
                </div>
            </div>
        `

        total += item.price * item.qtd
        cartItemsContainer.appendChild(cartItemElement)
    })
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    cartCounter.textContent = cart.length
}

cartItemsContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("remove-btn")){
        const name = e.target.getAttribute("data-name")
        removeFromCart(name)
    }
})

const removeFromCart = (name) => {
    const index = cart.findIndex(item => item.name === name)
    if(index !== -1) {
        const item = cart[index]
        if(item.qtd >1) {
            item.qtd -= 1
            updateCartModal()
            return
        }
        cart.splice(index, 1)
        updateCartModal()
    }
}

addressInput.addEventListener("input", (e) => {
    let inputValue = e.target.value;
    if(inputValue !== ""){
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", () => {
    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        Toastify({
            text: "O RESTAURANTE ESTÁ FECHADO NO MOMENTO!",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
              background: "#ef4444",},
        }).showToast();
        return
    }


    if(cart.length === 0) return
    if(addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        return
    }

    const cartItems = cart.map((item) => {
        return (
            `${item.name}; Quantidade: ${item.qtd} Preço: R$${item.price.toFixed(2)}`
        )
    }).join(" | ")
    // console.log(cartItems)
    const msg = encodeURIComponent(cartItems)
    const phone = "61986329574"

    window.open(`https://wa.me/${phone}?text=${msg} Endereço: ${addressInput.value}`, "_blamk")
    cart = []
    updateCartModal()
})

const checkRestaurantOpen = ()=> {
    const date = new Date()
    const hours = date.getHours()
    if(date.getDay(7))
    return hours >= 7 && hours < 18
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-600")
}