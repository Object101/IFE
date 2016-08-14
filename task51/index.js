/**
 * Created by LiangSen on 2016/8/14.
 */
let album;
window.addEventListener('load', function () {
  album = new Album('album');
  album.setLayout();
  album.addImg('http://placekitten.com/350/600');
});
