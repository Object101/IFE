class DynamicSystem {
  constructor(SpaceCraft) {
    this.SpaceCraft = SpaceCraft; //保存飞船对象，方便引用飞船的其他系统，同时防止飞船对象被回收
    this.anglePos = 0; //当前飞船位置
  }
  start() {
    let energy = this.SpaceCraft.EnergySystem.value,
        cost = this.cost;
    if (energy >= cost)  {
      this.SpaceCraft.EnergySystem.output(cost);
      this.SpaceCraft.show.classList.add('fly');
      this.SpaceCraft.isFlying = true;
      this.anglePos -= this.rotateSpeed;
      this.SpaceCraft.show.style.transform = 'rotate(' + this.anglePos + 'deg)';
      this.keeper = setTimeout(this.start.bind(this), 100);
    } else {
      this.stop();
    }
  }
  stop() {
    clearTimeout(this.keeper);
    this.SpaceCraft.show.classList.remove('fly');
    this.SpaceCraft.isFlying = false;
    let currentPos = this.anglePos;
    while (currentPos < -360) {
      currentPos += 360;
    }
    this.anglePos = currentPos;
    this.SpaceCraft.show.style.transform = 'rotate(' + this.anglePos + 'deg)';
  }
}

class BasicDynamicSystem extends DynamicSystem{
  constructor(SpaceCraft) {
    super(SpaceCraft);
    this.rotateSpeed = this.speed();
    this.cost = 0.5;
    this.type = 'basic';
  }
  speed() {
    switch (this.SpaceCraft.id) {
      case 1 : return 2.9;
      case 2 : return 1.9;
      case 3 : return 1.4;
      case 4 : return 1.1;
    }
  }
}

class ProfessionalDynamicSystem extends DynamicSystem{
  constructor(SpaceCraft) {
    super(SpaceCraft);
    this.rotateSpeed = this.speed();
    this.cost = 0.7;
    this.type = 'professional';
  }
  speed() {
    switch (this.SpaceCraft.id) {
      case 1 : return 4.8;
      case 2 : return 3.2;
      case 3 : return 2.4;
      case 4 : return 1.9;
    }
  }
}

class UltimateDynamicSystem extends DynamicSystem{
  constructor(SpaceCraft) {
    super(SpaceCraft);
    this.rotateSpeed = this.speed();
    this.cost = 0.9;
    this.type = 'ultimate';
  }
  speed() {
    switch (this.SpaceCraft.id) {
      case 1 : return 6.7;
      case 2 : return 4.48;
      case 3 : return 3.4;
      case 4 : return 2.7;
    }
  }
}

class EnergySystem {
  constructor(SpaceCraft) {
    this.SpaceCraft = SpaceCraft;
    this.value = 100;
    this.input();
  }
  input() {
    if (this.value <= this.inputCeil) {
      this.value += this.inputCell;
      this.refresh();
    }
    this.keeper = setTimeout(this.input.bind(this), 100);
  }
  output(cost) {
    this.value -= cost;
  }
  refresh() {
    this.SpaceCraft.show.innerHTML = Math.ceil(this.value) + '%';
  }
  stop() {
    clearTimeout(this.keeper);
  }
}

class BasicEnergySystem extends EnergySystem {
  constructor(SpaceCraft) {
    super(SpaceCraft);
    this.inputCell = 0.2;
    this.inputCeil = 99.8;
    this.type = 'basic';
  }
}

class ProfessionalEnergySystem extends EnergySystem {
  constructor(SpaceCraft) {
    super(SpaceCraft);
    this.inputCell = 0.3;
    this.inputCeil = 99.7;
    this.type = 'professional';
  }
}

class UltimateEnergySystem extends EnergySystem {
  constructor(SpaceCraft) {
    super(SpaceCraft);
    this.inputCell = 0.4;
    this.inputCeil = 99.6;
    this.type = 'ultimate';
  }
}