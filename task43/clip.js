function toAlbum(album) {
  /*计算图片数量*/
  let count = album.children.length;
  let prefix;
  switch (count) {
    case 1: prefix = 'one'; break;
    case 2: prefix = 'two'; break;
    case 3: prefix = 'three'; break;
    case 4: prefix = 'four'; break;
    case 5: prefix = 'five'; break;
    case 6: prefix = 'six'; break;
  }
  let imgs = album.children,
      i = 1;
  for (let img of imgs) {
    img.classList.add(prefix + '-' + i++);
  }
}
