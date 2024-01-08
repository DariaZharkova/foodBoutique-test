import fetchAPI from "./fetchApi.js";
import localStorageApi from "./localStorage.js";

// *******************************************************
//                    Fetch-Api
// *******************************************************

async function getProduct(page = 1, limit = 9) {
  const BASE_URL = "https://food-boutique.b.goit.study/api/products";
  const queryParams = new URLSearchParams({
    page: page,
    limit: limit,
  });
  const response = await axios.get(`${BASE_URL}?${queryParams}`);
  return response.data;
}

// async function getProductId(id) {
//   const BASE_URL = "https://food-boutique.b.goit.study/api/products/";
//   const response = await axios.get(`${BASE_URL}${id}`);
//   return response.data;
// }

// ******************************************************
//                    RenderCards
// ******************************************************

const cards = document.querySelector(".js-cards");
renderCards();

async function renderCards() {
  const data = await getProduct();
  cards.insertAdjacentHTML("beforeend", createMarkup(data.results));
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        _id,
        name,
        img,
      }) => `<li data-id="${_id}" class="item js-product-item">
            <img src="${img}" alt="${name}" width="300">
            <h2>${name}</h2>
            <button class="basket modal lightbox" data-type="basket"></button>
        </li>`
    )
    .join("");
}

// ******************************************************************
//                  Render Modal Window use basicLightbox
// ******************************************************************

cards.addEventListener("click", handleClick); //слухач на контейнер з лішками

function handleClick(event) {
  if (event.target === event.currentTarget) {
    return;
  }

  if (event.target.classList.contains("basket")) {
    // сюди потрібно прописати додавання продукту в Localstorage по id
    // console.log("you clicked basket");
  } else {
    // console.log("you clicked product");
    getProductModal(event, ".js-product-item");
  }
}

async function getProductModal(event, jsClass) {
  const currentProduct = event.target.closest(jsClass);
  const id = currentProduct.dataset.id;
  console.log(typeof id);
  const { name, desc, img, category, price, size, popularity } =
    await fetchAPI.product(id);
  console.log(name);
  let basketText = "Add to";

  let cart = localStorageApi.loadCart();
  // console.log(cart);
  if ("products" in cart) {
    const idx = cart.products.findIndex((product) => product.productId === id);
    if (idx !== -1) {
      basketText = "Remove from";
    }
  }

  onBasicLightbox(
    createProductModalMarkup(
      name,
      desc,
      img,
      category,
      price,
      size,
      popularity,
      basketText
    ),
    ".js-modal-close"
  );

  document
    .querySelector(".js-modal-product-cart")
    .addEventListener("click", (event) => {
      const btn = event.target.closest(".modal-product-cart");

      let cart = localStorageApi.loadCart();
      let notInCart = true;
      if ("products" in cart) {
        // console.log(cart.products);
        const resalt = cart.products.findIndex(
          (product) => product.productId === id
        );
        if (resalt !== -1) {
          cart.products.splice(resalt, 1);
          btn.querySelector(".baskettext").innerHTML = "Add to";
          notInCart = false;
          // localStorageApi.saveCart(cart);
        }
      }

      if (notInCart) {
        if ("products" in cart) {
          cart.products.push({
            productId: id,
            amount: 1,
          });
        } else {
          cart = {
            email: "",
            products: [{ productId: id, amount: 1 }],
          };
        }
        btn.querySelector(".baskettext").innerHTML = "Remove from";
      }
      localStorageApi.saveCart(cart);
    });
}

function createProductModalMarkup(
  name,
  desc,
  img,
  category,
  price,
  size,
  popularity,
  basketText
) {
  const productModalMarkup = `<div class="container">
  <div class="modal-product">
      <button class="modal-button js-modal-close" type="button" >
        <svg class="modal-form-icon" width="28" height="28">
              <use href="./img/icons.svg#close-icon"></use>
            </svg>
      </button>
      <div class="modal-product-top">
        <div class="modal-image-wrapper">
          <img
            class="modal-product-image"
            src="${img}"
            alt="${name}"
            width="160"
            height="160"
          />
        </div>
        <div class="modal-dscr-wrapper">
          <h3 class="modal-product-title">${name}</h3>
          <div class="modal-product-prop-wrap">
            <p class="modal-product-prop">
              Category:
              <span class="modal-product-prop-span">${category}</span>
            </p>
            <p class="modal-product-prop">
              Size:
              <span class="modal-product-prop-span">${size}</span>
            </p>
            </div>
            <p class="modal-product-prop">
              Popularity: <span class="modal-product-prop-span">${popularity}</span>
            </p>
          <p class="modal-product-prop-dscr">${desc}</p>
        </div>
      </div>
      <div class="modal-product-bottom">
        <p class="modal-product-price">$${price}</p>
        <button class="modal-product-cart js-modal-product-cart" type="button">
          <span class="baskettext">${basketText}</span> <svg class="modal-product-icon-basket" width="18" height="18">
              <use href="./img/icons.svg#shopping-cart-icon"></use>
            </svg>
        </button>
      </div>
    </div>
    </div>`;
  return productModalMarkup;
}

function onBasicLightbox(markup, querySelector) {
  const instance = basicLightbox.create(markup, {
    onShow: (instance) => {
      document.addEventListener("keydown", onModal);
      instance.element().querySelector(querySelector).onclick = instance.close;
    },

    onClose: () => {
      document.removeEventListener("keydown", onModal);
    },
  });

  function onModal(evt) {
    if (evt.key === "Escape") {
      instance.close();
    }
  }

  instance.show();
}

// *************************Імпорт SVG************************************

// import closeIcon from "./img/icons.svg#close-icon";
// import shoppingCartIcon from "./img/icons.svg#shopping-cart-icon";

// ********************Приклад******************************
// (() => {
//   const refs = {
//     openModalBtn: document.querySelector("[data-modal-open]"),
//     closeModalBtn: document.querySelector("[data-modal-close]"),
//     modal: document.querySelector("[data-modal]"),
//   };

//   refs.openModalBtn.addEventListener("click", toggleModal);
//   refs.closeModalBtn.addEventListener("click", toggleModal);

//   function toggleModal() {
//     refs.modal.classList.toggle("is-hidden");
//   }
// })();

// ********************Приклад******************************
// const refs = {
//   openModalBtn: document.querySelector('[data-action="open-modal"]'),
//   closeModalBtn: document.querySelector('[data-action="close-modal"]'),
//   backdrop: document.querySelector(".js-backdrop"),
// };

// const ESC_KEY_CODE = "Escape";

// refs.openModalBtn.addEventListener("click", onOpenModal);
// refs.closeModalBtn.addEventListener("click", onCloseModal);
// refs.backdrop.addEventListener("click", onBackdropClick);

// function onOpenModal() {
//   window.addEventListener("keydown", onEscKeyPress);
//   document.body.classList.add("show-modal");
// }

// function onCloseModal() {
//   window.removeEventListener("keydown", onEscKeyPress);
//   document.body.classList.remove("show-modal");
// }

// function onBackdropClick(event) {
//   if (event.currentTarget === event.target) {
//     onCloseModal();
//   }
// }

// function onEscKeyPress(event) {
//   const isEscCode = event.code === ESC_KEY_CODE;
//   if (isEscCode) {
//     onCloseModal();
//   }
// }
// **************************************************
// async function handleClick(event) {
//   if (event.target === event.currentTarget) {
//     return;
//   }
//   const currentProduct = event.target.closest(".js-product-item");
//   const id = currentProduct.dataset.id;
//   const { name, desc, img, category, price, size, popularity } =
//     await getProductId(id);

//   // Render Modal Window
//   const murkup = `<div class="modal-product">
//         <button class="modal-button js-modal-close" type="button" data-modal-close>
//           <svg class="modal-form-icon" width="28" height="28">
//                 <use href="./img/icons.svg#close-icon"></use>
//               </svg>
//         </button>
//         <div class="modal-product-top">
//           <div class="modal-image-wrapper">
//             <img
//               class="modal-product-image"
//               src="${img}"
//               alt="${name}"
//               width="160"
//               height="160"
//             />
//           </div>
//           <div class="modal-dscr-wrapper">
//             <h3 class="modal-product-title">${name}</h3>
//             <div class="modal-product-prop-wrap">
//               <p class="modal-product-prop">
//                 Category:
//                 <span class="modal-product-prop-span">${category}</span>
//               </p>
//               <p class="modal-product-prop">
//                 Size:
//                 <span class="modal-product-prop-span">${size}</span>
//               </p>
//               <p class="modal-product-prop">
//                 Popularity: <span class="modal-product-prop-span">${popularity}</span>
//               </p>
//             </div>
//             <p class="modal-product-prop-dscr">${desc}</p>
//           </div>
//         </div>
//         <div class="modal-product-bottom">
//           <p class="modal-product-price">$${price}</p>
//           <button class="modal-product-cart" type="button">
//             Add to<svg class="modal-form-icon" width="18" height="18">
//                 <use href="./img/icons.svg#shopping-cart-icon"></use>
//               </svg>
//           </button>
//         </div>
//       </div>`;

//   modalContainer.innerHTML = murkup;
//   modalContainer.classList.toggle("is-hidden");
// }

// function _load(key) {
//   try {
//     const jsonData = localStorage.getItem(key);
//     if (jsonData === null) {
//       return {};
//     } else {
//       const data = JSON.parse(jsonData);
//       return data;
//     }
//   } catch (error) {
//     throw error;
//   }
// }
