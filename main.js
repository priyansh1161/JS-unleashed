var Person = function (name,maxHealth,maxPower){
    this.name = name;
    this.maxHealth = maxHealth;
    this.currHealth = maxHealth;
    this.maxPower = maxPower;
    this.isAlive = true;
};
Person.prototype.die = function () {
    this.isAlive = false;
};
Person.prototype.takeDamage = function (damage) {
    if(this.currHealth - damage <= 0 )
        this.die();
    else
        this.currHealth -= damage;
};
Person.prototype.attack = function (enemy){
   if (enemy instanceof Person){
       enemy.takeDamage(this.maxPower);
       alert(this.name + ' inflicted ' + this.maxPower.toString() + ' damage to ' + enemy.name);
       !enemy.isAlive && alert(this.name + ' killed ' + enemy.name);
   }
   else
       throw new Error('Wrong param passed');
};


Protagonist = function (name) {
    Person.call(this,name,100,30);
    this.level = 1;
};
Protagonist.prototype = Object.create(Person.prototype);
Protagonist.prototype.constructor = Protagonist;
Protagonist.prototype.levelUp = function (power, health) {
    this.level += Math.floor((power + health)/20);
    this.maxHealth += this.level * 1.3;
    this.maxPower += this.level * 0.7;
    this.currHealth += 15;
    alert('your new level is ' + this.level );
};
Protagonist.prototype.attack = function (enemy) {
    try {
        Person.prototype.attack.call(this,enemy);
    } catch (err){
        console.log(err.message);
    }
    !enemy.isAlive && this.levelUp(enemy.maxPower,enemy.maxHealth);
};
Protagonist.prototype.heal = function () {
      if (this.currHealth + this.level < this.maxHealth )
            this.currHealth += this.level;
      else
          this.currHealth = this.maxHealth;

};
function CreateEnemy (name) {
    name = name || 'Enemy';
    var maxHealth = 3 + Math.floor(Math.random()*100);
    var maxPower = 3 + Math.floor(Math.random()*10);
    return new Person(name, maxHealth, maxPower);
}
function init() {
    var containerEnemies = {};
    containerEnemies['magneto'] = CreateEnemy('magneto');
    containerEnemies['deadpool'] = CreateEnemy('deadpool');
    containerEnemies['apocalypse'] = CreateEnemy('apocalypse');
    containerEnemies['raven'] = CreateEnemy('raven');
    containerEnemies['cyclops'] = CreateEnemy('cyclops');
    return containerEnemies;
}
var enemies = init();
function resetGame() {
    enemies = init();
    logan = new Protagonist('Logan');
}
var logan = new Protagonist('Logan');
function makeMove(toAttack) {
    if (!(enemies[toAttack] && enemies[toAttack].isAlive) ) {
        alert('Enemy dose not exist');
    }
    else {
        var target = enemies[toAttack];
        logan.attack(target);

        (function attackLogan(){
            if (!target.isAlive) {
                var temp = {};
                for (var key in enemies) {
                    if (enemies.hasOwnProperty(key)) {
                        if (key !== target.name) {
                            temp[key] = enemies[key];
                        }
                    }
                }
                enemies = temp;
            }
            for (var key in enemies) {
                if (enemies.hasOwnProperty(key)) {
                    enemies[key].attack(logan);
                }
            }
        })();

        if (logan.isAlive)
            logan.heal();
        else {
            alert('Game Over');
            resetGame();
        }

    }
}

(function main() {
    while(true){
        var toDisplay = [];
        toDisplay.push('name \t Health \t attack');
        for(var key in enemies){
            toDisplay.push(key +'\t'+ enemies[key].currHealth + '/' +enemies[key].maxHealth +'\t'+ enemies[key].maxPower);
        }
        if(toDisplay.length === 1 ){
            alert('You Won !!');
            resetGame();
        }
        toDisplay.push('You \t'+ logan.currHealth + '/' + logan.maxHealth +' \t '+ logan.maxPower);
        // alert(toDisplay.join('\n'));
        var toAttack = prompt( toDisplay.join('\n') + '\nEnter Enemy name to attack'+'\nType exit to Exit');
        if(toAttack === 'exit')
            return;
        makeMove(toAttack);
    }
})();
