function getLength(str) {
  var realLength = 0,
      length = str.length;
  for (var i = 0; i < length; i++) {
    var charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 255) {
      realLength += 1;
    } else {
      realLength += 2;
    }
  }
  return realLength;
}

window.onload = function() {
  var form = document.querySelector('#form'),
      submit = document.querySelector('#submit');
  form.addEventListener('focusin', function(e) {
    var target = e.target,
        id = target.id,
        tip = target.nextElementSibling;
    if (target.classList.contains('error')) {
      target.classList.remove('error');
    } else {
      target.classList.remove('right');
    }
    target.classList.add('focus');
    switch (id) {
      case 'username':
        tip.innerHTML = '必填，长度为4~16个字符';
        break;
      case 'password':
        tip.innerHTML = '请输入6到16位数字和字母';
        break;
      case 'passwordms':
        tip.innerHTML = '再次输入相同密码';
        break;
      case 'mail':
        tip.innerHTML = '例：example@ps.com';
        break;
      case 'phone':
        tip.innerHTML = '请输入11位手机号码';
        break;
    }
  });
  form.addEventListener('focusout', function(e) {
    var target = e.target,
        id = target.id,
        value = target.value.trim(),
        length = getLength(value),
        tip = target.nextElementSibling;
    target.isValid = false;
    switch (id) {
      case 'username':
        if (value === '') {
          tip.innerHTML = '用户名不能为空';
          target.classList.add('error');
        } else if (length > 16 || length < 4) {
          tip.innerHTML = '请检查名称字符数';
          target.classList.add('error');
        } else {
          tip.innerHTML = '名称可用';
          target.classList.add('right');
          target.isValid = true;
        }
        break;
      case 'password':
        if (value === '') {
          tip.innerHTML = '密码不能为空';
          target.classList.add('error');
        } else if (length < 6 || length > 16 || !value.match(/^[A-Za-z0-9]+$/)) {
          tip.innerHTML = '请输入6到16位字符且只能为数字和字母';
          target.classList.add('error');
        } else {
          tip.innerHTML = '密码可用';
          target.classList.add('right');
          target.isValid = true;
        }
        break;
      case 'passwordms':
        var passwordDes = target.previousElementSibling.previousElementSibling.innerHTML;
            passwordValue = target.previousElementSibling.previousElementSibling.previousElementSibling.value;
        if (value !== passwordValue) {
          tip.innerHTML = '密码不一致';
          target.classList.add('error');
        } else if (passwordDes !== '密码可用') {
          tip.innerHTML = passwordDes;
          target.classList.add('error');
        } else {
          tip.innerHTML = '密码输入一致';
          target.classList.add('right');
          target.isValid = true;
        }
        break;
      case 'mail':
        if (value === '') {
          tip.innerHTML = '邮箱不能为空';
          target.classList.add('error');
        } else if (!value.match(/^.+@.+\..+$/)) {
          tip.innerHTML = '邮箱格式错误';
          target.classList.add('error');
        } else {
          tip.innerHTML = '邮箱格式正确';
          target.classList.add('right');
          target.isValid = true;
        }
        break;
      case 'phone':
        if (value === '') {
          tip.innerHTML = '手机不能为空';
          target.classList.add('error');
        } else if (!value.match(/^[0-9]{11}$/)) {
          tip.innerHTML = '手机格式错误';
          target.classList.add('error');
        } else {
          tip.innerHTML = '手机格式正确';
          target.classList.add('right');
          target.isValid = true;
        }
        break;
    }
  });
  submit.addEventListener('click', function(e) {
    e.preventDefault();
    var inputs = document.querySelectorAll('input'),
        length = inputs.length - 1;
    for (var i = 0; i < length; i++) {
      if (!inputs[i].isValid) {
        alert('提交失败');
        return;
      }
    }
    alert('提交成功');
    return;
  });
}