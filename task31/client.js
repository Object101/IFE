window.addEventListener('load', function() {
  var select1 = document.querySelector('#city'),
      select2 = document.querySelector('#school'),
      university = {
        '北京': ['北京大学', '清华大学', '北京航空航天大学'],
        '上海': ['复旦大学', '上海交通大学', '同济大学'],
        '杭州': ['浙江大学', '杭州电子科技大学', '浙江工业大学']
      };
  select1.addEventListener('change', function(e) {
    var city = this.value,
        schools = university[city],
        length = schools.length,
        frag = document.createDocumentFragment();
    for (var i = 0; i < length; i++) {
      var option = document.createElement('option'),
          school = schools[i];
      option.value = school;
      option.text = school;
      frag.appendChild(option);
    }
    select2.innerHTML = '';
    select2.appendChild(frag);
  });
});