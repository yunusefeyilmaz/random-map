// Add initial text to span elements
document.querySelectorAll('.slider').forEach(slider => {
    const inputId = slider.id;
    console.log(inputId); 
    const valueElement = document.getElementById(inputId + "Value");
    valueElement.textContent = slider.value;
    slider.addEventListener('input', function() {
    const inputId = this.id;
    const valueElement = document.getElementById(inputId + "Value");
    valueElement.textContent = this.value;
  });
});