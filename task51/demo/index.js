/**
 * Created by LiangSen on 2016/8/14.
 */

window.addEventListener('DOMContentLoaded', function () {
  let album = new Album('album');
  album.setLayout();
  let control = document.getElementById('controlPanel');
  control.addEventListener('click', function (e) {
    let target = e.target;
    let ID = target.id;
    switch (ID) {
      case 'add':
        album.addImg(target.previousElementSibling.value);
        break;
      case 'addRandom':
        let width = Math.round(Math.random() * 4) * 50 + 400;
        let height = Math.round(Math.random() * 4) * 50 + 400;
        let colors = ['003', '00c', '063', '06c', '0f3', '0fc', '633', '63c', '903', '90c', '9f3', '9fc', 'fc3', 'fcc'];
        let randomColor = colors[Math.round(Math.random() * 13)];
        let newURL = 'https://placehold.it/' + width + 'x' + height + '/' + randomColor;
        target.previousElementSibling.previousElementSibling.value = newURL;
        album.addImg(newURL);
        break;
      case 'clear':
        album.setImage('', {layout: album.layout});
        break;
      case 'puzzle':
        album.setLayout(target.value);
        break;
      case 'waterfall':
        album.setLayout(target.value);
        break;
      case 'barrel':
        album.setLayout(target.value);
        break;
      case 'on':
        album.enableFullscreen();
        break;
      case 'off':
        album.disableFullscreen();
        break;
      case 'gutterX':
        album.setGutter(parseInt(target.value), parseInt(target.nextElementSibling.value));
        break;
      case 'gutterY':
        album.setGutter(parseInt(target.previousElementSibling.value), parseInt(target.value));
        break;
      case 'col':
        album.setCols(parseInt(target.value));
        break;
      case 'baseHeight':
        album.setBaseHeight(parseInt(target.value));
    }
  });
  let head = control.children[0];
  head.onmousedown = function (e) {
    control.isDraging = true;
    control.offsetX = e.offsetX;
    control.offsetY = e.offsetY;
  };
  document.body.onmousemove = function (e) {
    if (control.isDraging) {
      control.style.top = e.clientY - control.offsetY + 'px';
      control.style.left = e.clientX - control.offsetX + 'px';
    }
  };
  document.body.onmouseup = function () {
    control.isDraging = false;
  };
});
