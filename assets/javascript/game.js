
$(document).ready(function() 
{

//audio clip for the game play
    var lightsaber = new Audio('assets/audio/Lightsaber Clash-SoundBible.com-203518049.mp3');

//Array of playable jedi character objects
    var jediCharacters = {
        'yoda': {
            name: 'yoda',
            health: 200,
            attack: 15,
            imageUrl: "assets/images/yoda.png",
            enemyAttackBack: 8
        }, 
        'luke': {
            name: 'luke',
            health: 180,
            attack: 14,
            imageUrl: "assets/images/luke.png",
            enemyAttackBack: 5
        }, 
        'obi': {
            name: 'obi',
            health: 170,
            attack: 8,
            imageUrl: "assets/images/obi.png",
            enemyAttackBack: 20
        }, 
        'rey': {
            name: 'rey',
            health: 160,
            attack: 7,
            imageUrl: "assets/images/rey.png",
            enemyAttackBack: 20
        }
    };

// Array of playable sith character objects
    var sithCharacters = {
        'darth vader': {
            name: 'darth vader',
            health: 160,
            attack: 8,
            imageUrl: "assets/images/darth_vadar.png",
            enemyAttackBack: 15
        }, 
        'darth maul': {
            name: 'darth maul',
            health: 100,
            attack: 14,
            imageUrl: "assets/images/darth_maul.png",
            enemyAttackBack: 5
        }, 
        'kylo ren': {
            name: 'kylo ren',
            health: 150,
            attack: 8,
            imageUrl: "assets/images/kylo.png",
            enemyAttackBack: 20
        }, 
        'darth sidious': {
            name: 'darth sidous',
            health: 180,
            attack: 7,
            imageUrl: "assets/images/darth_sidious.png",
            enemyAttackBack: 20
        }
    };
// global game play variables
    var currSelectedCharacter;
    var currDefender;
    var combatants = [];
    var indexofSelChar;
    var attackResult;
    var turnCounter = 1;
    var killCount = 0;

// function to render the Jedi Characters
    var renderJediCharacter = function(jediCharacter, renderArea, makeChar) 
    {
    //character: obj, renderArea: class/id, makeChar: string
        var charDiv = $("<div class='character' data-name='" + jediCharacter.name + "'>");
        var charName = $("<div class='character-name'>").text(jediCharacter.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", jediCharacter.imageUrl);
        var charHealth = $("<div class='character-health'>").text(jediCharacter.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
    //Capitalizes the first letter in characters name
    // $('.character').css('textTransform', 'capitalize');
    // conditional render
        if (makeChar == 'enemy') 
        {
            $(charDiv).addClass('enemy');
        } 
        else if (makeChar == 'defender') 
        {
            currDefender = jediCharacter;
             $(charDiv).addClass('target-enemy');
        }
    };

// function to render game message for the user into the DOM
    var renderMessage = function(message) 
    {
    //set up the message to display for the users
        var gameMesageSet = $("#gameMessage");
        var newMessage = $("<div>").text(message);
        gameMesageSet.append(newMessage);
    
    // condiional statement to clear the message block area
        if (message == 'clearMessage') 
        {
            gameMesageSet.text('');
        }
    };
/////////////// --------WORKING ON THIS PART OF THE CODE
    var renderCharacters = function(charObj, areaRender) 
    {
        //render all jedi characters
        if (areaRender == '#jedi-characters-section') 
        {
            $(areaRender).empty();
            for (var key in charObj) 
            {
                if (charObj.hasOwnProperty(key)) 
                {
                    renderJediCharacter(charObj[key], areaRender, '');
                }
            }
        }
    //render player character
    if (areaRender == '#selected-character') {
      $('#selected-character').prepend("Your Character");       
      renderOne(charObj, areaRender, '');
      $('#attack-button').css('visibility', 'visible');
    }
    //render combatants
    if (areaRender == '#available-to-attack-section') {
        $('#available-to-attack-section').prepend("Choose Your Next Opponent");      
      for (var i = 0; i < charObj.length; i++) {

        renderOne(charObj[i], areaRender, 'enemy');
      }
      //render one enemy to defender area
      $(document).on('click', '.enemy', function() {
        //select an combatant to fight
        name = ($(this).data('name'));
        //if defernder area is empty
        if ($('#defender').children().length === 0) {
          renderJedi(name, '#defender');
          $(this).hide();
          renderMessage("clearMessage");
        }
      });
    }
    //render defender
    if (areaRender == '#defender') {
      $(areaRender).empty();
      for (var i = 0; i < combatants.length; i++) {
        //add enemy to defender area
        if (combatants[i].name == charObj) {
          $('#defender').append("Your selected opponent")
          renderOne(combatants[i], areaRender, 'defender');
        }
      }
    }
    //re-render defender when attacked
    if (areaRender == 'playerDamage') {
      $('#defender').empty();
      $('#defender').append("Your selected opponent")
      renderOne(charObj, '#defender', 'defender');
      lightsaber.play();
    }
    //re-render player character when attacked
    if (areaRender == 'enemyDamage') {
      $('#selected-character').empty();
      renderOne(charObj, '#selected-character', '');
    }
    //render defeated enemy
    if (areaRender == 'enemyDefeated') {
      $('#defender').empty();
      var gameStateMessage = "You have defated " + charObj.name + ", you can choose to fight another enemy.";
      renderMessage(gameStateMessage);
      blaster.play();
    }
  };
  //this is to render all characters for user to choose their computer
  renderJedi(jediCharacters, '#jedi-characters-section');
  $(document).on('click', '.character', function() {
    name = $(this).data('name');
    //if no player char has been selected
    if (!currSelectedCharacter) {
      currSelectedCharacter = jediCharacters[name];
      for (var key in jediCharacters) {
        if (key != name) {
          combatants.push(jediCharacters[key]);
        }
      }
      $("#characters-section").hide();
      renderJedi(currSelectedCharacter, '#selected-character');
      //this is to render all characters for user to choose fight against
      renderJedi(combatants, '#available-to-attack-section');
    }
  });

  // ----------------------------------------------------------------
  // Create functions to enable actions between objects.
  $("#attack-button").on("click", function() {
    //if defernder area has enemy
    if ($('#defender').children().length !== 0) {
      //defender state change
      var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
      renderMessage("clearMessage");
      //combat
      currDefender.health = currDefender.health - (currSelectedCharacter.attack * turnCounter);

      //win condition
      if (currDefender.health > 0) {
        //enemy not dead keep playing
        renderJedi(currDefender, 'playerDamage');
        //player state change
        var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
        renderMessage(attackMessage);
        renderMessage(counterAttackMessage);

        currSelectedCharacter.health = currSelectedCharacter.health - currDefender.enemyAttackBack;
        renderJedi(currSelectedCharacter, 'enemyDamage');
        if (currSelectedCharacter.health <= 0) {
          renderMessage("clearMessage");
          restartGame("You have been defeated...GAME OVER!!!");
          force.play();
          $("#attack-button").unbind("click");
        }
      } else {
        renderJedi(currDefender, 'enemyDefeated');
        killCount++;
        if (killCount >= 3) {
          renderMessage("clearMessage");
          restartGame("You Won!!!! GAME OVER!!!");
          jediKnow.play();
          // The following line will play the imperial march:
          setTimeout(function() {
          audio.play();
          }, 2000);

        }
      }
      turnCounter++;
    } else {
      renderMessage("clearMessage");
      renderMessage("No enemy here.");
      rtwoo.play();
    }
  });

//Restarts the game - renders a reset button
  var restartGame = function(inputEndGame) {
    //When 'Restart' button is clicked, reload the page.
    var restart = $('<button class="btn">Restart</button>').click(function() {
      location.reload();
    });
    var gameState = $("<div>").text(inputEndGame);
    $("#gameMessage").append(gameState);
    $("#gameMessage").append(restart);
  };
});