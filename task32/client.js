function isNotEmpty(str) {
  if (str === '') {
    return false;
  } else {
    return true;
  }
}

window.addEventListener('load', function() {
  var add = document.querySelector('#add'),
      jsonText = document.querySelector('#userinput'),
      content = document.querySelector('#content');
  add.addEventListener('click', function(e) {
    e.preventDefault();
    var value = JSON.parse(jsonText.value),
        name = value.label,
        type = value.type,
        validator = value.validator,
        rules = value.rules,
        success = value.success,
        fail = value.fail,
        form = document.createElement(type),
        tip = document.createElement('p');
    switch (validator) {
      case 'isNotEmpty':
        validator = isNotEmpty;
    }
    form.name = name;
    form.addEventListener('focusin', function(e) {
      var target = e.target,
          tip = target.nextElementSibling;
      if (target.classList.contains('right')) {
        target.classList.remove('right');
      } else {
        target.classList.remove('error');
      }
      tip.innerHTML = rules;
    });
    form.addEventListener('focusout', function(e) {
      var target = e.target,
          tip = target.nextElementSibling;
      if (validator(target.value)) {
        tip.innerHTML = success;
        target.classList.add('right');
      } else {
        tip.innerHTML = fail;
        target.classList.add('error');
      }
    })
    content.appendChild(form);
    content.appendChild(tip);
  })
})