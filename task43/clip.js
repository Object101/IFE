!function () {
  'use strict';
  function toAlbum(album) {
    /*计算图片数量*/
    let count = album.children.length;
    switch (count) {
      case 1: let prefix = 'one'; break;
      case 2: let prefix = 'two'; break;
      case 3: let prefix = 'three'; break;
      case 4: let prefix = 'four'; break;
      case 5: let prefix = 'five'; break;
      case 6: let prefix = 'six'; break;
    }
    let imgs = album.children,
        i = 1;
    for (let img of imgs) {
      img.classList.add(prefix + '-' + i++);
    }
  }
  window.addEventListener('DOMContentLoaded', function () {
    let albums = document.getElementsByClassName('album');
    for (let album of albums) {
      toAlbum(album);
    }
  });
}();
