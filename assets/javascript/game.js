
$(document).ready(function() 
{

// audio clip for the game play
    var lightsaber = new Audio('assets/audio/lightsaber.mp3');

// Array of playable character objects
    var characters = {
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
        },
        'vader': {
            name: 'vader',
            health: 160,
            attack: 8,
            imageUrl: "assets/images/darth_vadar.png",
            enemyAttackBack: 20
        }, 
        'maul': {
            name: 'maul',
            health: 100,
            attack: 14,
            imageUrl: "assets/images/darth_maul.png",
            enemyAttackBack: 20
        }, 
        'ren': {
            name: 'ren',
            health: 150,
            attack: 8,
            imageUrl: "assets/images/kylo.png",
            enemyAttackBack: 20
        }, 
        'sidious': {
            name: 'sidous',
            health: 180,
            attack: 7,
            imageUrl: "assets/images/darth_sidious.png",
            enemyAttackBack: 20
        }
    };

    
// global game play variables
    var currSelectedCharacter; // current selected character
    var currentDefender;       // current defender
    var battleOpponents = [];  // array to hold other battle opponents
    var turnCounter = 1;       // turn counter for each attack
    var killCounter = 0;       // keep count of opponents deaths

// function to render the characters
var renderEveryCharacter = function(characters, renderArea, makeCharacter) 
{
    //character: obj, renderArea: class/id, makeChar: string
    var characterDiv = $("<div class='character' data-name='" + characters.name + "'>");
    var characterName = $("<div class='character-name'>").text(characters.name);
    var characterImage = $("<img alt='image' class='character-image'>").attr("src", characters.imageUrl);
    var characterHealth = $("<div class='character-health'>").text(characters.health);
    characterDiv.append(characterName).append(characterImage).append(characterHealth);
    $(renderArea).append(characterDiv);
    
    // conditional render of characters 
    if (makeCharacter == 'enemy') 
    {
        $(characterDiv).addClass('enemy');
    } 
    else if (makeCharacter == 'defender') 
    {
      currentDefender = characters;
      $(characterDiv).addClass('target-enemy');
    }
}; 
// function to render game message for the user into the DOM
var renderMessage = function(message) 
{
    var gameMesageSet = $("#gameMessage");
    var newMessage = $("<div>").text(message);
    gameMesageSet.append(newMessage);

    if (message == 'clearMessage') 
    {
      gameMesageSet.text('');
    }
};
   
// Render the characters function
var renderStarWarsChar = function(charObj, battleArea) 
{
    // render all characters to the game battle area of the screen
    if (battleArea == '#characters-section') 
    {
        $(battleArea).empty();
        for (var key in charObj) 
        {
        if (charObj.hasOwnProperty(key)) 
        {
            renderEveryCharacter(charObj[key], battleArea, '');
        }
      }
    }
    //render players selected character
    if (battleArea == '#selected-character') 
    {
        $('#selected-character').append("Your Character");       
        renderEveryCharacter(charObj, battleArea, '');
        $('#attack-button').css('visibility', 'visible');
    }
    //render combatants for the player to battle
    if (battleArea == '#available-to-attack-section') 
    {
        $('#available-to-attack-section').prepend("Choose Your Next Opponent");      
        for (var i = 0; i < charObj.length; i++) 
        {
            renderEveryCharacter(charObj[i], battleArea, 'enemy');
        }
        // render one enemy to defender area
        $(document).on('click', '.enemy', function() 
        {
            //select an combatant to fight
            name = ($(this).data('name'));
            //if defernder area is empty
            if ($('#defender').children().length === 0) 
            {
            renderStarWarsChar(name, '#defender');
            $(this).hide();
            renderMessage("clearMessage");
            }
        });
    }
    // render defender to battle area
    if (battleArea == '#defender') 
    {
        $(battleArea).empty();
        for (var i = 0; i < battleOpponents.length; i++) 
        {
            //add enemy to defender area
            if (battleOpponents[i].name == charObj) 
            {
                $('#defender').append("Your selected opponent")
                renderEveryCharacter(battleOpponents[i], battleArea, 'defender');
            }
        }
    }
    // re-render defender when attacked
    if (battleArea == 'playerDamage') 
    {
        $('#defender').empty();
        $('#defender').append("Your selected opponent")
        renderEveryCharacter(charObj, '#defender', 'defender');
        lightsaber.play();
    }
    // re-render player character when attacked
    if (battleArea == 'enemyDamage') 
    {
        $('#selected-character').empty();
        renderEveryCharacter(charObj, '#selected-character', '');    
    }
    // render the defeated enemy and make it disappear
    if (battleArea == 'enemyDefeated') 
    {
        $('#defender').empty();
        var gameStateMessage = "You have defeated " + charObj.name + ", you can choose to fight another enemy.";
        renderMessage(gameStateMessage);
    }
}; 
// this is to render all characters for user to choose vs the computer
renderStarWarsChar(characters, '#characters-section');
$(document).on('click', '.character', function() 
{
    name = $(this).data('name');
    //if no player character has been selected
    if (!currSelectedCharacter) 
    {
        currSelectedCharacter = characters[name];
        for (var key in characters) 
        {
            if (key != name) 
            {
                battleOpponents.push(characters[key]);
            }
        }
        $("#characters-section").hide();
        renderStarWarsChar(currSelectedCharacter, '#selected-character');
      
        //this is to render all characters for user to choose fight against
        renderStarWarsChar(battleOpponents, '#available-to-attack-section');
    }
});

// Create functions to enable actions between objects.
$("#attack-button").on("click", function() 
{
    // if defender area has an enemy
    if ($('#defender').children().length !== 0) 
    {
        // Change defenders message and display for user
        var attackMessage = "You attacked " + currentDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
        renderMessage("clearMessage");

        // equation to substract points during battle
        currentDefender.health = currentDefender.health - (currSelectedCharacter.attack * turnCounter);

        // win condition
        if (currentDefender.health > 0) 
        {
            //enemy not dead keep playing
            renderStarWarsChar(currentDefender, 'playerDamage');

            //player state change
            var counterAttackMessage = currentDefender.name + " attacked you back for " + currentDefender.enemyAttackBack + " damage.";
            renderMessage(attackMessage);
            renderMessage(counterAttackMessage);

            currSelectedCharacter.health = currSelectedCharacter.health - currentDefender.enemyAttackBack;
            renderStarWarsChar(currSelectedCharacter, 'enemyDamage');
            if (currSelectedCharacter.health <= 0) 
            {
                renderMessage("clearMessage");
                restartGame("You have been defeated...GAME OVER!!!");
                $("#attack-button").unbind("click");
            }
        } 
        else 
        {
            renderStarWarsChar(currentDefender, 'enemyDefeated');
            killCounter++;
            if (killCounter >= 7) 
            {
                renderMessage("clearMessage");
                restartGame("You Won!!!! GAME OVER!!!");

            }
        }
    turnCounter++;
    } 
    else 
    {
        renderMessage("clearMessage");
        renderMessage("No enemy here.");
     
    }
});    

// Restarts the game - renders a reset button
var restartGame = function(inputEndGame) 
{
    //When 'Restart' button is clicked, reload the page.
    var restart = $('<button class="btn">Restart</button>').click(function() 
    {
        location.reload();
    });
        var gameState = $("<div>").text(inputEndGame);
        $("#gameMessage").append(gameState);
        $("#gameMessage").append(restart);
};    
});