##多功能相册类库

[DEMO](http://object101.github.io/IFE/task51/demo/index.html)

###使用方法

1. 包含Album.css和Album.js在html文件中。
~~~html
  <link rel="stylesheet" href="Album.css">
  <script src="Album.js"></script>
~~~

2. 创建一个div作为相册容器，需设置id，宽度。若要使用拼图布局需设置高度。
~~~html
  <div id="album" class="myalbum"></div>
~~~

3. 使用div容器的id作为参数构造相册实例。
~~~javascript
  let album = new Album('album');
~~~

4. 为相册添加图片并设置布局。
~~~javascript
  album.setImage('https://placehold.it/350x500/ff0', {layout: 'barrel', baseHeight: 300});
~~~
