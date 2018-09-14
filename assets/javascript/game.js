
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
        'vader': {
            name: 'vader',
            health: 160,
            attack: 8,
            imageUrl: "assets/images/darth_vadar.png",
            enemyAttackBack: 15
        }, 
        'maul': {
            name: 'maul',
            health: 100,
            attack: 14,
            imageUrl: "assets/images/darth_maul.png",
            enemyAttackBack: 5
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
    var currSelectedCharacter;
    var currDefender;
    var combatants = [];
    var turnCounter = 1;
    var killCount = 0;

// function to render the Jedi Characters
    var renderJediCharacter = function(jediCharacters,renderAreaJedi, makeChar) 
    {
    //character: obj, renderArea: class/id, makeChar: string
        var charDiv = $("<div class='character' data-name='" + jediCharacters.name + "'>");
        var charName = $("<div class='character-name'>").text(jediCharacters.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", jediCharacters.imageUrl);
        var charHealth = $("<div class='character-health'>").text(jediCharacters.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderAreaJedi).append(charDiv);
   
    // conditional render to put character an enemy or defender
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
// function to render the sith character
    var renderSithCharacter = function(sithCharacters, renderAreaSith, makeChar)
    {
    //character: obj, renderArea: class/id, makeChar: string
        var charDiv = $("<div class='character' data-name='" + sithCharacters.name + "'>");
        var charName = $("<div class='character-name'>").text(sithCharacters.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", sithCharacters.imageUrl);
        var charHealth = $("<div class='character-health'>").text(sithCharacters.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderAreaSith).append(charDiv);
   
    // conditional render
        if (makeChar == 'enemy') 
        {
            $(charDiv).addClass('enemy');
        } 
        else if (makeChar == 'defender') 
        {
            currDefender = sithCharacter;
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
/////////////// --------WORKING ON THIS RENDER CHARACTER SECTION OF CODE OF THE CODE
    var renderCharacters = function(charObj, areaRenderJedi, areaRenderSith) 
    {
        //render all jedi characters
        if (areaRenderJedi == '#jedi-characters-section') 
        {
            $(areaRenderJedi).empty();
            for (var key in charObj) 
            {
                if (charObj.hasOwnProperty(key)) 
                {
                    renderJediCharacter(charObj[key], areaRenderJedi, '');
                }
            }
        }
        // render all sith characters
        if (areaRenderSith == '#sith-characters-section')
        {
            $(areaRenderSith).empty();
            for(var key in charObj)
            {
                if (charObj.hasOwnProperty(key))
                {
                    renderSithCharacter(charObj[key], areaRenderSith, '');
                }
            }
        }

    // conditional render of player selected character
        if (areaRenderJedi == '#selected-character') 
        {
            $('#selected-character').prepend("Your Character");       
            renderOne(charObj, areaRenderJedi, '');
            $('#attack-button').css('visibility', 'visible');
        }
        if (areaRenderSith == '#selected-character')
        {
            $('#selected-character').prepend("Your Character");
            renderOne(charObj, areaRenderSith, '');
            $('#attack-button').css('visibility', 'visible');
        }
       
    //render combatants
        if (areaRenderJedi == '#available-to-attack-section') 
        {
            $('#available-to-attack-section').prepend("Choose Your Next Opponent");      
                for (var i = 0; i < charObj.length; i++) 
                {
                    renderOne(charObj[i], areaRenderSith, 'enemy');
                }
    //render one enemy to defender area
            $(document).on('click', '.enemy', function() 
            {
            //select an combatant to fight
            name = ($(this).data('name'));
            //if defender area is empty
                if ($('#defender').children().length === 0) 
                {
                    renderCharacters(name, '#defender');
                    $(this).hide();
                    renderMessage("clearMessage"); 
                }
            });
        }
    //render defender
        if (areaRenderJedi == '#defender') 
        {
            $(areaRenderSith).empty();
            for (var i = 0; i < combatants.length; i++) 
            {
            //add enemy to defender area
                if (combatants[i].name === charObj) 
                {
                    $('#defender').append("Your selected opponent")
                    renderOne(combatants[i], areaRenderSith, 'defender');
                }
            }
        }
    //re-render defender when attacked
        if (areaRenderJedi == 'playerDamage') 
        {
            $('#defender').empty();
            $('#defender').append("Your selected opponent")
            renderOne(charObj, '#defender', 'defender');
            lightsaber.play();
        }
    //re-render player character when attacked
        if (areaRenderSith == 'enemyDamage') 
        {
            $('#selected-character').empty();
            renderOne(charObj, '#selected-character', '');
        }
    //render defeated enemy
        if (areaRenderSith == 'enemyDefeated') 
        {
            $('#defender').empty();
            var gameStateMessage = "You have defeated " + charObj.name + ", you can choose to fight another enemy.";
            renderMessage(gameStateMessage);
        }
    };
// this is to render all jedi characters for user to choose vs the computer
    renderCharacters(jediCharacters, '#jedi-characters-section');
    $(document).on('click', '.character', function() 
    {
        name = $(this).data('name');
        //if no player character has been selected
        if (!currSelectedCharacter) 
        {
            currSelectedCharacter === jediCharacters[name];
            for (var key in jediCharacters) 
            {
                if (key !== name) 
                {
                    combatants.push(sithCharacters[key]);
                }
            }
            $("#jedi-characters-section").hide();
            renderJediCharacter(currSelectedCharacter, '#selected-character');
            //this is to render all characters for user to choose fight against
            renderSithCharacter(combatants, '#available-to-attack-section');
        }
    });
// This is to render all sith characters for user to choose vs the computer
    renderSithCharacters(sithCharacter, '#sith-characters-section');
        $(document).on('click', '.character', function() 
        {
            name = $(this).data('name');
            //if no player character has been selected
            if (!currSelectedCharacter) 
            {
                currSelectedCharacter === sithCharacters[name];
                for (var key in sithCharacters) 
                {
                    if (key !== name) 
                    {
                        combatants.push(jediCharacters[key]);
                    }
                }
                $("#characters-section").hide();
                renderSithCharacter(currSelectedCharacter, '#selected-character');
                //this is to render all characters for user to choose fight against
                renderJediCharacter(combatants, '#available-to-attack-section');
            }
        });


  // ---------------------------------------------------------------- //
// Create functions to enable actions between objects.
    $("#attack-button").on("click", function() 
    {
    //if defender area has an enemy
    if ($('#defender').children().length !== 0) 
    {
        //defender state change
        var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
        renderMessage("clearMessage");
        //combat
        currDefender.health = currDefender.health - (currSelectedCharacter.attack * turnCounter);

        //win condition
        if (currDefender.health > 0) 
        {
            //enemy not dead keep playing
            renderCharacters(currDefender, 'playerDamage');
            //player state change
            var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
            renderMessage(attackMessage);
            renderMessage(counterAttackMessage);

            currSelectedCharacter.health = currSelectedCharacter.health - currDefender.enemyAttackBack;
            renderCharacters(currSelectedCharacter, 'enemyDamage');
            if (currSelectedCharacter.health <= 0) 
            {
                renderMessage("clearMessage");
                restartGame("You have been defeated...GAME OVER!!!");
                $("#attack-button").unbind("click");
            }
        } 
        else 
        {
            renderCharacters(currDefender, 'enemyDefeated');
            killCount++;
                if (killCount >= 3) 
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

//Restarts the game - renders a reset button
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