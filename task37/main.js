window.addEventListener('load', function() {
  var button = document.querySelector('#fl');
  var floatLayer = document.querySelector('#mask');
  fl.addEventListener('click', function() {
    floatLayer.classList.remove('hidden');
  });
  floatLayer.addEventListener('click', function(e) {
    var id = e.target.id;
    if (id === 'mask' || id === 'yes' || id === 'no') {
      this.classList.add('hidden');
    }
  });
  var floatUI = floatLayer.children[0];
  var head = floatUI.children[0];
  head.addEventListener('mousedown', function(e) {
    floatUI.isDraging = true;
    floatUI.mouseX = e.offsetX - 250;
    floatUI.mouseY = e.offsetY - 150;
  });
  document.body.addEventListener('mousemove', function(e) {
    console.log();
    if (floatUI.isDraging) {
      floatUI.style.top = e.clientY - floatUI.mouseY + 'px';
      floatUI.style.left = e.clientX - floatUI.mouseX + 'px';
    }
  });
  document.body.addEventListener('mouseup', function() {
    floatUI.isDraging = false;
  });
});