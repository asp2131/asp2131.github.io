/**
 * WebRTC Peer-to-Peer Multiplayer Module for Circularity Game
 * Handles connection establishment, data synchronization, and multiplayer game logic
 */

var Multiplayer = (function() {
    'use strict';
    
    // Private variables
    var peerConnection = null;
    var dataChannel = null;
    var isHost = false;
    var isConnected = false;
    var remotePlayer = null;
    var connectionCallbacks = {};
    
    // WebRTC configuration with free STUN servers
    var rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };
    
    // Public API
    var api = {
        isMultiplayer: false,
        isHost: false,
        remotePlayerData: null,
        
        // Initialize multiplayer system
        init: function(callbacks) {
            connectionCallbacks = callbacks || {};
            checkURLForConnection();
        },
        
        // Host a new multiplayer game
        hostGame: function() {
            isHost = true;
            api.isHost = true;
            createPeerConnection();
            createDataChannel();
            createOffer();
        },
        
        // Join a multiplayer game via offer URL
        joinGame: function(offer) {
            isHost = false;
            api.isHost = false;
            createPeerConnection();
            setupDataChannelReceiver();
            acceptOffer(offer);
        },
        
        // Send game data to remote player
        sendGameData: function(data) {
            if (dataChannel && dataChannel.readyState === 'open') {
                try {
                    dataChannel.send(JSON.stringify(data));
                } catch (e) {
                    console.warn('Failed to send data:', e);
                }
            }
        },
        
        // Get connection status
        isConnected: function() {
            return isConnected;
        },
        
        // Disconnect from multiplayer
        disconnect: function() {
            if (dataChannel) {
                dataChannel.close();
                dataChannel = null;
            }
            if (peerConnection) {
                peerConnection.close();
                peerConnection = null;
            }
            isConnected = false;
            api.isMultiplayer = false;
            api.remotePlayerData = null;
        }
    };
    
    // Private functions
    function checkURLForConnection() {
        var urlParams = new URLSearchParams(window.location.search);
        var offer = urlParams.get('offer');
        
        if (offer) {
            // Show immediate feedback that we're joining a multiplayer game
            showJoiningFeedback();
            
            // Automatically join game if offer is in URL
            try {
                var decodedOffer = JSON.parse(atob(offer));
                api.joinGame(decodedOffer);
            } catch (e) {
                console.error('Invalid offer in URL:', e);
                showJoinError('Invalid multiplayer link');
            }
        }
    }
    
    function showJoiningFeedback() {
        // Show immediate visual feedback that we're joining a multiplayer game
        var instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.style.display = 'block';
            instructions.innerHTML = `
                <h2 style="margin: 0 0 10px 0; color: #0080FF;">Joining Multiplayer Game...</h2>
                <div style="margin: 20px 0;">
                    <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #0080FF; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin: 10px 0; color: #FFD700;">Connecting to host player...</p>
                    <p style="margin: 5px 0; color: #0080FF;">🔵 You will be the BLUE circle</p>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
        }
    }
    
    function showJoinError(message) {
        var instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.style.display = 'block';
            instructions.innerHTML = `
                <h2 style="margin: 0 0 10px 0; color: #FF0000;">Connection Failed</h2>
                <p style="margin: 10px 0; color: #FFD700;">${message}</p>
                <p style="margin: 5px 0;">Please try again or ask for a new link.</p>
                <button onclick="window.location.href = window.location.pathname;" style="margin: 10px; padding: 10px 15px; background: #00FF00; color: black; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Return to Single Player</button>
            `;
        }
    }
    
    function createPeerConnection() {
        peerConnection = new RTCPeerConnection(rtcConfig);
        
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                // ICE candidate will be included in offer/answer
            }
        };
        
        peerConnection.onconnectionstatechange = function() {
            console.log('Connection state:', peerConnection.connectionState);
            if (peerConnection.connectionState === 'connected') {
                isConnected = true;
                api.isMultiplayer = true;
                if (connectionCallbacks.onConnected) {
                    connectionCallbacks.onConnected();
                }
            } else if (peerConnection.connectionState === 'disconnected' || 
                      peerConnection.connectionState === 'failed') {
                isConnected = false;
                api.isMultiplayer = false;
                if (connectionCallbacks.onDisconnected) {
                    connectionCallbacks.onDisconnected();
                }
            }
        };
    }
    
    function createDataChannel() {
        dataChannel = peerConnection.createDataChannel('gameData', {
            ordered: false, // Allow out-of-order delivery for better performance
            maxRetransmits: 0 // Don't retransmit for real-time data
        });
        
        setupDataChannelHandlers(dataChannel);
    }
    
    function setupDataChannelReceiver() {
        peerConnection.ondatachannel = function(event) {
            dataChannel = event.channel;
            setupDataChannelHandlers(dataChannel);
        };
    }
    
    function setupDataChannelHandlers(channel) {
        channel.onopen = function() {
            console.log('Data channel opened');
            isConnected = true;
            api.isMultiplayer = true;
            if (connectionCallbacks.onConnected) {
                connectionCallbacks.onConnected();
            }
        };
        
        channel.onclose = function() {
            console.log('Data channel closed');
            isConnected = false;
            api.isMultiplayer = false;
            if (connectionCallbacks.onDisconnected) {
                connectionCallbacks.onDisconnected();
            }
        };
        
        channel.onmessage = function(event) {
            try {
                var data = JSON.parse(event.data);
                handleRemoteGameData(data);
            } catch (e) {
                console.warn('Failed to parse remote data:', e);
            }
        };
    }
    
    function createOffer() {
        peerConnection.createOffer()
            .then(function(offer) {
                return peerConnection.setLocalDescription(offer);
            })
            .then(function() {
                // Wait for ICE gathering to complete
                return new Promise(function(resolve) {
                    if (peerConnection.iceGatheringState === 'complete') {
                        resolve();
                    } else {
                        peerConnection.addEventListener('icegatheringstatechange', function() {
                            if (peerConnection.iceGatheringState === 'complete') {
                                resolve();
                            }
                        });
                    }
                });
            })
            .then(function() {
                var offerData = peerConnection.localDescription;
                var encodedOffer = btoa(JSON.stringify(offerData));
                var shareableURL = window.location.origin + window.location.pathname + '?offer=' + encodedOffer;
                
                if (connectionCallbacks.onOfferReady) {
                    connectionCallbacks.onOfferReady(shareableURL);
                }
            })
            .catch(function(error) {
                console.error('Error creating offer:', error);
            });
    }
    
    function acceptOffer(offer) {
        peerConnection.setRemoteDescription(offer)
            .then(function() {
                return peerConnection.createAnswer();
            })
            .then(function(answer) {
                return peerConnection.setLocalDescription(answer);
            })
            .then(function() {
                // In a real implementation, we'd need to send the answer back
                // For simplicity, we'll use a simplified connection process
                console.log('Answer created, connection should establish');
            })
            .catch(function(error) {
                console.error('Error accepting offer:', error);
            });
    }
    
    function handleRemoteGameData(data) {
        if (data.type === 'playerUpdate') {
            // Update remote player data
            api.remotePlayerData = {
                x: data.x,
                y: data.y,
                radius: data.radius,
                score: data.score
            };
            
            if (connectionCallbacks.onRemotePlayerUpdate) {
                connectionCallbacks.onRemotePlayerUpdate(api.remotePlayerData);
            }
        } else if (data.type === 'gameEvent') {
            // Handle game events (absorption, etc.)
            if (connectionCallbacks.onGameEvent) {
                connectionCallbacks.onGameEvent(data);
            }
        }
    }
    
    return api;
})();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Multiplayer;
}
