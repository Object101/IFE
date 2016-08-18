##多功能相册类库

[DEMO](http://object101.github.io/IFE/task51/demo/index.html)

###使用方法
1. 包含Album.css和Album.js在html文件中。
~~~html
  <link rel="stylesheet" href="Album.css">
  <script src="Album.js"></script>
~~~

2. 创建一个div作为相册容器，需指定id，宽度。若要使用拼图布局需指定高度。若添加类名应避免'album'，以免和框架冲突
~~~html
  <div id="album" class="myalbum"></div>
~~~

3. 使用div容器的id作为参数构造相册实例。
~~~javascript
  let album = new Album('album');
~~~

4. 初始化相册。
~~~javascript
  album.setImage('https://placehold.it/350x500/ff0', {layout: 'barrel', baseHeight: 300});
~~~

5. API
  *注：以下方法皆在相册实例上调用。
  1. setImage(url[options])
    清除相册全部图片并添加src为url的图片，url也可以为多个url组成的数组
    options包括：layout(布局样式)，gutterX(横向间距)，gutterY(纵向间距)，col(瀑布布局列数)，baseHeight(木桶布局基准高度)
  2. setLayout(layout[options])
    改变布局样式，options包括：gutterX(横向间距)，gutterY(纵向间距)，col(瀑布布局列数)，baseHeight(木桶布局基准高度)
  3. addImage(url)
    添加图片，url也可以为数组(添加多张图片)。返回img元素方便设置其他属性(若参数为数组，则返回img元素组成的数组)。
  4. setGutter(x[y])
    设置横向间距为x，纵向间距为y，若未指定y，则和x相同。
  5. setCols(col)
    设置瀑布布局的列数
  6. setBaseHeight(baseHeight)
    设置木桶布局基准高度。
  7. enableFullscreen() && disableFullscreen()
    允许和禁止点击图片查看原始图片。