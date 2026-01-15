document.addEventListener("DOMContentLoaded", function () {

      const PRODUCT_ID = "<%= PRODUCT %>";
      if (!PRODUCT_ID) return;

      const PRODUCTS = {
        orthopedic_cervical_pillow: {
          title: "Orthopedic Cervical Pillow",
          price: 120
        },
        posture_corrector_belt: {
          title: "Posture Corrector Belt",
          price: 80
        },
        lumbar_support_cushion: {
          title: "Lumbar Support Cushion",
          price: 60
        },
        therapy_massage_tool: {
          title: "Therapy Massage Tool",
          price: 90
        }
      };

      if (!PRODUCTS[PRODUCT_ID]) return;

      const product = PRODUCTS[PRODUCT_ID];

      const qtyInput = document.querySelector(".js-quantity");
      const btnPlus  = document.querySelector(".js-btn-plus");
      const btnMinus = document.querySelector(".js-btn-minus");
      const btnAdd   = document.querySelector(".buy-now");

      if (!qtyInput || !btnPlus || !btnMinus || !btnAdd) return;

      // + quantity
      btnPlus.addEventListener("click", () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
      });

      // - quantity (never below 1)
      btnMinus.addEventListener("click", () => {
        const val = parseInt(qtyInput.value);
        if (val > 1) qtyInput.value = val - 1;
      });

      // Add to cart
      btnAdd.addEventListener("click", function () {

        const qty = parseInt(qtyInput.value);
        if (qty <= 0) return;

        let cart = JSON.parse(localStorage.getItem("cart")) || {};

        if (cart[PRODUCT_ID]) {
          cart[PRODUCT_ID].qty += qty;
        } else {
          cart[PRODUCT_ID] = {
            id: PRODUCT_ID,
            title: product.title,
            price: product.price,
            qty: qty
          };
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        showSuccessBox("Added to cart successfully");
        
        //location.reload(); 

        function showSuccessBox(message) 
        {
          const box = document.getElementById("cart-success-box");
          if (!box) return;

          box.textContent = message;
          box.classList.add("show");

          setTimeout(() => {
            box.classList.remove("show");
          }, 2500);
        }

      });

    });