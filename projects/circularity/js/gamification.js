/**
 * Gamification Module for Circularity Game
 * Contains all player controls, absorption mechanics, and multiplayer features
 * Only activates when educational TODOs are completed
 */

var Gamification = (function() {
    'use strict';
    
    // Private variables
    var player = null;
    var remotePlayer = null;
    var keys = {};
    var score = 0;
    var gameStarted = false;
    var gameMode = 'single';
    var gameTimer = 60;
    var timerInterval = null;
    var gamificationUnlocked = false;
    
    // Game references (will be set by init)
    var canvas, view, draw, physikz, circles, game;
    
    // Public API
    var api = {
        // Initialize the gamification system
        init: function(gameReferences) {
            canvas = gameReferences.canvas;
            view = gameReferences.view;
            draw = gameReferences.draw;
            physikz = gameReferences.physikz;
            circles = gameReferences.circles;
            game = gameReferences.game;
            
            setupKeyboardControls();
            setupUIEventListeners();
            
            // Initialize multiplayer system
            Multiplayer.init({
                onConnected: function() {
                    console.log('Connected to remote player');
                    showConnectionSuccess();
                    createRemotePlayer();
                    startMultiplayerGame();
                },
                onDisconnected: function() {
                    console.log('Disconnected from remote player');
                    hideMultiplayerStatus();
                    alert('Connection lost! Returning to single player mode.');
                    resetGame();
                },
                onOfferReady: function(shareableURL) {
                    document.getElementById('shareLink').value = shareableURL;
                    document.getElementById('statusText').textContent = 'Share this link with a friend:';
                },
                onRemotePlayerUpdate: function(data) {
                    if (remotePlayer && data) {
                        remotePlayer.x = data.x;
                        remotePlayer.y = data.y;
                        remotePlayer.radius = data.radius;
                        remotePlayer.scaleX = remotePlayer.scaleY = data.radius / 10;
                        
                        // Update opponent score display
                        var opponentScore = document.querySelector('#multiplayerScore div');
                        if (opponentScore) {
                            opponentScore.textContent = 'Opponent: Size ' + Math.floor(data.radius);
                        }
                    }
                }
            });
        },
        
        // Update function called from main game loop
        update: function() {
            checkGameificationUnlock();
            
            // Update player and handle absorption (only if unlocked)
            if (gameStarted && gamificationUnlocked) {
                updatePlayer();
                handleAbsorption();
                
                // Send player data to remote player in multiplayer
                if (Multiplayer.isMultiplayer && Multiplayer.isConnected()) {
                    Multiplayer.sendGameData({
                        type: 'playerUpdate',
                        x: player.x,
                        y: player.y,
                        radius: player.radius,
                        score: score
                    });
                }
                
                // Update remote player position
                updateRemotePlayer();
            }
        },
        
        // Check if gamification is unlocked
        isUnlocked: function() {
            return gamificationUnlocked;
        }
    };
    
    // Private functions
    
    // Create the player-controlled circle
    function createPlayer() {
        var playerColor = Multiplayer.isMultiplayer && !Multiplayer.isHost ? '#0080FF' : '#00FF00';
        player = draw.randomCircleInArea(canvas, true, true, playerColor, 3);
        player.radius = 15;
        player.scaleX = player.scaleY = player.radius / 10;
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
        player.velocityX = 0;
        player.velocityY = 0;
        player.speed = 3;
        view.addChild(player);
    }
    
    // Create remote player circle for multiplayer
    function createRemotePlayer() {
        if (remotePlayer) {
            view.removeChild(remotePlayer);
        }
        var remoteColor = Multiplayer.isHost ? '#0080FF' : '#00FF00';
        remotePlayer = draw.randomCircleInArea(canvas, true, true, remoteColor, 3);
        remotePlayer.radius = 15;
        remotePlayer.scaleX = remotePlayer.scaleY = remotePlayer.radius / 10;
        remotePlayer.x = canvas.width / 4;
        remotePlayer.y = canvas.height / 4;
        view.addChild(remotePlayer);
    }
    
    // Set up keyboard event listeners
    function setupKeyboardControls() {
        document.addEventListener('keydown', function(event) {
            keys[event.key.toLowerCase()] = true;
            if (!gameStarted && gameMode === 'single' && gamificationUnlocked) {
                startSinglePlayerGame();
            }
        });
        
        document.addEventListener('keyup', function(event) {
            keys[event.key.toLowerCase()] = false;
        });
    }
    
    // Update player movement based on key presses
    function updatePlayer() {
        // Reset velocity
        player.velocityX = 0;
        player.velocityY = 0;
        
        // Check for key presses and set velocity
        if (keys['w'] || keys['arrowup']) {
            player.velocityY = -player.speed;
        }
        if (keys['s'] || keys['arrowdown']) {
            player.velocityY = player.speed;
        }
        if (keys['a'] || keys['arrowleft']) {
            player.velocityX = -player.speed;
        }
        if (keys['d'] || keys['arrowright']) {
            player.velocityX = player.speed;
        }
        
        // Apply movement
        player.x += player.velocityX;
        player.y += player.velocityY;
        
        // Keep player in bounds (wrap around screen)
        game.checkCirclePosition(player);
    }
    
    // Check collision between two circles
    function checkCollision(circle1, circle2) {
        var dx = circle1.x - circle2.x;
        var dy = circle1.y - circle2.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var combinedRadius = (circle1.radius || 10) + (circle2.radius || 10);
        return distance < combinedRadius;
    }
    
    // Handle absorption when player collides with other circles
    function handleAbsorption() {
        for (var i = circles.length - 1; i >= 0; i--) {
            var otherCircle = circles[i];
            
            if (checkCollision(player, otherCircle)) {
                var playerSize = player.radius || 10;
                var otherSize = otherCircle.radius || 10;
                
                if (playerSize >= otherSize) {
                    // Player absorbs the other circle
                    absorb(player, otherCircle, i);
                } else {
                    // Other circle absorbs player - game over
                    gameOver();
                    return;
                }
            }
        }
    }
    
    // Absorb a circle and grow the player
    function absorb(absorber, absorbed, index) {
        // Calculate new size (area-based growth)
        var absorberArea = Math.PI * Math.pow(absorber.radius, 2);
        var absorbedArea = Math.PI * Math.pow(absorbed.radius || 10, 2);
        var newArea = absorberArea + absorbedArea * 0.3; // Gain 30% of absorbed area for faster growth
        var newRadius = Math.sqrt(newArea / Math.PI);
        
        // Update absorber size
        absorber.radius = newRadius;
        absorber.scaleX = absorber.scaleY = newRadius / 10;
        
        // Remove absorbed circle
        view.removeChild(absorbed);
        circles.splice(index, 1);
        
        // Update score
        score += Math.floor(absorbed.radius || 10);
        updateScore();
        
        // Create a new circle to maintain population
        var circle = draw.randomCircleInArea(canvas, true, true, '#999', 2);
        physikz.addRandomVelocity(circle, canvas);
        view.addChild(circle);
        circles.push(circle);
    }
    
    // Update score display
    function updateScore() {
        var scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = 'Score: ' + score + ' | Size: ' + Math.floor(player.radius);
        }
    }
    
    // Game over function
    function gameOver() {
        if (gameMode === 'multiplayer') {
            endMultiplayerGame('You were absorbed!');
        } else {
            alert('Game Over! Final Score: ' + score);
            resetGame();
        }
    }
    
    // Reset game to initial state
    function resetGame() {
        score = 0;
        if (player) {
            player.radius = 15;
            player.scaleX = player.scaleY = 1.5;
            player.x = canvas.width / 2;
            player.y = canvas.height / 2;
        }
        gameStarted = false;
        gameMode = 'single';
        document.getElementById('instructions').style.display = gamificationUnlocked ? 'block' : 'none';
        document.getElementById('multiplayerScore').style.display = 'none';
        updateScore();
    }
    
    // Set up UI event listeners
    function setupUIEventListeners() {
        document.getElementById('singlePlayerBtn').addEventListener('click', function() {
            gameMode = 'single';
            document.getElementById('singlePlayerInstructions').style.display = 'block';
            document.getElementById('multiplayerInstructions').style.display = 'none';
            document.getElementById('connectionStatus').style.display = 'none';
            document.getElementById('gameMode').style.display = 'none';
        });
        
        document.getElementById('hostGameBtn').addEventListener('click', function() {
            gameMode = 'multiplayer';
            document.getElementById('singlePlayerInstructions').style.display = 'none';
            document.getElementById('multiplayerInstructions').style.display = 'block';
            document.getElementById('connectionStatus').style.display = 'block';
            document.getElementById('gameMode').style.display = 'none';
            
            // Start hosting
            Multiplayer.hostGame();
        });
    }
    
    // Start single player game
    function startSinglePlayerGame() {
        gameStarted = true;
        gameMode = 'single';
        document.getElementById('instructions').style.display = 'none';
        if (!player) createPlayer();
    }
    
    // Start multiplayer game
    function startMultiplayerGame() {
        gameStarted = true;
        gameMode = 'multiplayer';
        gameTimer = 60;
        document.getElementById('instructions').style.display = 'none';
        document.getElementById('multiplayerScore').style.display = 'block';
        
        if (!player) createPlayer();
        
        // Start countdown timer
        timerInterval = setInterval(function() {
            gameTimer--;
            document.getElementById('gameTimer').textContent = 'Time: ' + gameTimer + 's';
            
            if (gameTimer <= 0) {
                endMultiplayerGame();
            }
        }, 1000);
    }
    
    // End multiplayer game
    function endMultiplayerGame(reason) {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        var message = reason || 'Time\'s up!';
        var remoteSize = Multiplayer.remotePlayerData ? Multiplayer.remotePlayerData.radius : 15;
        
        if (player.radius > remoteSize) {
            message += ' You win with size ' + Math.floor(player.radius) + '!';
        } else if (player.radius < remoteSize) {
            message += ' Opponent wins with size ' + Math.floor(remoteSize) + '!';
        } else {
            message += ' It\'s a tie!';
        }
        
        alert(message);
        Multiplayer.disconnect();
        resetGame();
    }
    
    // Update remote player (handle multiplayer collisions)
    function updateRemotePlayer() {
        if (!remotePlayer || !Multiplayer.isMultiplayer) return;
        
        // Check collision between local player and remote player
        if (checkCollision(player, remotePlayer)) {
            var playerSize = player.radius;
            var remoteSize = remotePlayer.radius;
            
            if (playerSize > remoteSize * 1.2) { // Need significant size advantage
                // Local player absorbs remote player
                absorb(player, remotePlayer, -1);
                endMultiplayerGame('You absorbed your opponent!');
            } else if (remoteSize > playerSize * 1.2) {
                // Remote player absorbs local player
                endMultiplayerGame('Your opponent absorbed you!');
            }
        }
    }
    
    // Check if gamification features should be unlocked
    function checkGameificationUnlock() {
        // Simple conditional: unlock if 100 circles exist AND TODO 9 is implemented
        var hasHundredCircles = circles && circles.length >= 100;
        var hasTodo9Implementation = checkTodo9Implementation();
        
        var shouldUnlock = hasHundredCircles && hasTodo9Implementation;
        
        if (shouldUnlock && !gamificationUnlocked) {
            // Just unlocked - show the game UI
            gamificationUnlocked = true;
            document.getElementById('instructions').style.display = 'block';
            console.log('🎮 Gamification features unlocked! All TODOs completed.');
        } else if (!shouldUnlock && gamificationUnlocked) {
            // Lock it back if conditions are no longer met
            gamificationUnlocked = false;
            document.getElementById('instructions').style.display = 'none';
        }
    }
    
    // Check if TODO 9 (iteration over array) is implemented
    function checkTodo9Implementation() {
        // TODO 9 requires iterating over the circles array in the update function
        // We can detect this by checking if circles are being updated properly
        if (!circles || circles.length === 0) return false;
        
        // Check if at least some circles have velocity (indicating they're being updated)
        var updatedCircles = 0;
        for (var i = 0; i < Math.min(10, circles.length); i++) {
            var circle = circles[i];
            if (circle && (Math.abs(circle.velocityX) > 0 || Math.abs(circle.velocityY) > 0)) {
                updatedCircles++;
            }
        }
        
        // If most circles have velocity, TODO 9 is likely implemented
        return updatedCircles >= Math.min(5, circles.length);
    }
    
    // Show connection success feedback
    function showConnectionSuccess() {
        var instructions = document.getElementById('instructions');
        if (instructions) {
            var roleText = Multiplayer.isHost ? '🟢 You are the HOST (GREEN circle)' : '🔵 You are the GUEST (BLUE circle)';
            var roleColor = Multiplayer.isHost ? '#00FF00' : '#0080FF';
            
            instructions.innerHTML = `
                <h2 style="margin: 0 0 10px 0; color: ${roleColor};">✅ Connected to Multiplayer Game!</h2>
                <div style="margin: 20px 0;">
                    <p style="margin: 10px 0; color: #FFD700; font-size: 18px; font-weight: bold;">🎉 Connection Successful!</p>
                    <p style="margin: 5px 0; color: ${roleColor}; font-size: 16px;">${roleText}</p>
                    <p style="margin: 5px 0;">Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to move</p>
                    <p style="margin: 5px 0;">Absorb circles and each other to grow!</p>
                    <p style="margin: 5px 0;">Biggest circle after 60 seconds wins!</p>
                    <p style="margin: 15px 0 5px 0; color: #FFD700;"><strong>Press any key to start!</strong></p>
                </div>
            `;
            
            // Show persistent multiplayer status
            showMultiplayerStatus();
        }
    }
    
    // Show persistent multiplayer status indicator
    function showMultiplayerStatus() {
        // Remove existing status if any
        var existingStatus = document.getElementById('multiplayerStatus');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        // Create new status indicator
        var statusDiv = document.createElement('div');
        statusDiv.id = 'multiplayerStatus';
        var roleText = Multiplayer.isHost ? 'HOST' : 'GUEST';
        var roleColor = Multiplayer.isHost ? '#00FF00' : '#0080FF';
        
        statusDiv.style.cssText = `
            position: absolute;
            top: 50px;
            left: 10px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            z-index: 10;
            background: rgba(0,0,0,0.7);
            padding: 8px 12px;
            border-radius: 5px;
            border-left: 4px solid ${roleColor};
        `;
        
        statusDiv.innerHTML = `
            <div style="color: ${roleColor};">🌐 MULTIPLAYER</div>
            <div style="color: #FFD700; font-size: 12px;">${roleText} • Connected</div>
        `;
        
        // Add to the canvas container
        var canvasContainer = document.querySelector('div[style*="position: relative"]');
        if (canvasContainer) {
            canvasContainer.appendChild(statusDiv);
        }
    }
    
    // Hide multiplayer status indicator
    function hideMultiplayerStatus() {
        var statusDiv = document.getElementById('multiplayerStatus');
        if (statusDiv) {
            statusDiv.remove();
        }
    }
    
    return api;
})();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Gamification;
}
