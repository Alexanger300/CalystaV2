const form = document.getElementById("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("nom", document.getElementById("nom").value);
  formData.append("email", document.getElementById("email").value);

  fetch("https://script.google.com/macros/s/AKfycbwIoru1A1meHgwEg0Yn0AVzxLKRT70mXd8jU0jjM9vuUubtc9GDDj1Rj0ErxJoq77geQw/exec", {
    method: "POST",
    body: formData
  })
  .then(() => {
    alert("Données envoyées avec succès !");
    form.reset();
  })
  .catch(err => {
    console.error(err);
    alert("Erreur lors de l'envoi");
  });
});
