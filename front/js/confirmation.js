let param = new URL(document.location).searchParams;
let id = param.get("id");

console.log(id);
document.getElementById('orderId').innerText = id;