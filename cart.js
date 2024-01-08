import fetchAPI from "./fetchApi.js";
import localStorageApi from "./localStorage.js";

async function drawProductCart() {
  let cart = localStorageApi.loadCart();
  console.log(cart);

  const productsInCart = [];
  if ("products" in cart) {
    cart.products.forEach(({ productId }) =>
      getProductApi(productId).then((resp) => productsInCart.push(resp))
    );
  }
  console.log(productsInCart);
  console.log("products" in cart);
}
drawProductCart();

async function getProductApi(id) {
  const product = await fetchAPI.product(id);
  return product;
}

{
  /* <button data-productId="${_id}" class="js-btn-del-prod" type="button">
  <svg class="" width="" height="">
    <use href="./img/icons.svg#close-icon"></use>
  </svg>
</button>; */
}

// document
//   .querySelector(".js-btn-del-prod")
//   .addEventListener("click", (event) => {
//     const id = event.target.dataset.productId;

//     let cart = localStorageApi.loadCart();
//     if ("products" in cart) {
//       const resalt = cart.products.findIndex(
//         (product) => product.productId === id
//       );
//       if (resalt !== -1) {
//         cart.products.splice(resalt, 1);
//       }
//     }

//     localStorageApi.saveCart(cart);
//   });

document.querySelector(".dell-all").addEventListener("click", () => {
  localStorageApi.deleteCart();
});
