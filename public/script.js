const toCurrency = price => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "rub",
    style: "currency",
  }).format(price);
};

document.querySelectorAll(".price").forEach(item => {
  item.textContent = toCurrency(item.textContent);
});
