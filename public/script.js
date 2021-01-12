const toCurrency = price => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "rub",
    style: "currency",
  }).format(price);
};

const toDate = date => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
};

document.querySelectorAll(".price").forEach(item => {
  item.textContent = toCurrency(item.textContent);
});

document.querySelectorAll(".date").forEach(item => {
  item.textContent = toDate(item.textContent);
});

const cart = document.querySelector(".cart");

cart.addEventListener("click", event => {
  const target = event.target;
  if (target.classList.contains("remove")) {
    const id = target.dataset.id;
    fetch(`/cart/remove/${id}`, {
      method: "delete",
    })
      .then(res => res.json())
      .then(data => {
        if (data.items.length) {
          const html = data.items.map(item => {
            return `<tr>
              <td>${item.title}</td>
              <td>${item.count}</td>
                <td>
                   <button class="waves-effect waves-light btn-small remove" data-id="${item.id}">Удалить</button>
                </td>
            </tr>
            `;
          });
          cart.querySelector("tbody").innerHTML = html.join("");
          cart.querySelector(".price").innerHTML = toCurrency(data.totalPrice);
        } else {
          cart.innerHTML = "<p>Корзина пустая</p>";
        }
      });
  }
});
