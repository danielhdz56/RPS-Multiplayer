// Initialize Firebase
var config = {
apiKey: "AIzaSyCbEBWJpgRA8xE4kL_ePr2d36h09tY7dDQ",
authDomain: "rps2-9d634.firebaseapp.com",
databaseURL: "https://rps2-9d634.firebaseio.com",
projectId: "rps2-9d634",
storageBucket: "",
messagingSenderId: "289286483599"
};
firebase.initializeApp(config);
var database = firebase.database();
var refPlayers = database.ref('players');
var refTurns = database.ref('turn');
var refChat = database.ref('chat');
var playerNumber;
var name;
var player1;
var player2;
var opponent;
var choices = ['Rock', 'Paper', 'Scissors'];
var playerChoice;
var turn;



if(sessionStorage.getItem('player')!==null && sessionStorage.getItem('player')!=='undefined'){
	var data;
	playerNumber = sessionStorage.getItem('player');
	playerName = sessionStorage.getItem('name');
	playerWins = Number(sessionStorage.getItem('wins'));
	playerLosses = Number(sessionStorage.getItem('losses'));
	playerChoice = sessionStorage.getItem('choice');
	rpsTurn = Number(sessionStorage.getItem('turn'));
	if(playerNumber==1){
		data = {
			1: {
				name: playerName,
				wins: playerWins,
				losses: playerLosses,
				choice: playerChoice
			}
		};
		$('#panel-player1 .panel-body h3').html(playerChoice);
	}
	else{
		data = {
			2: {
				name: playerName,
				wins: playerWins,
				losses: playerLosses,
				choice: playerChoice 
			}
		};
	}
	var messenger = sessionStorage.getItem('name');
	refChat.update({
		'messenger': messenger + ' HAS CONNECTED!'
	});
	refPlayers.update(data);
	refTurns.set(rpsTurn);
	refPlayers.once('value', function(snapshot){
		name = snapshot.val()[playerNumber].name;
	})
	$('#messageToClient').empty().addClass('panel panel-default').append('<div class="panel-body text-center">Hi ' + name + ' you are Player ' + playerNumber + '</div><p id="message"></p>')
}
else if(sessionStorage.getItem('player')==='undefined') {
	$('#messageToClient').empty().addClass('panel panel-default').append('<div class="panel-body text-center">Hi ' + name + ' you are a Spectator</div>')
}
refPlayers.on('value', function(snapshot){
	if(sessionStorage.getItem('player')!==null && sessionStorage.getItem('player')!=='undefined'){
		//this makes sure to remove player that disconnects
		refPlayers.child(sessionStorage.getItem('player')).onDisconnect().remove();
		refTurns.onDisconnect().remove();
		var messenger = sessionStorage.getItem('name');
		refChat.onDisconnect().update({
			'messenger': messenger + ' HAS DISCONNECTED!'
		});
	}
	player1 = snapshot.child('1').val();
	player2 = snapshot.child('2').val();
	if(snapshot.child('1').exists()){
		$('#panel-player1 .panel-body h4').html(player1.name);
		$('#panel-player1 .panel-footer').html('Wins: ' + player1.wins + ' Losses: ' + player1.losses);
	}
	else{
		$('#panel-player1 .panel-body h4').html('Waiting for Player 1');
		$('#panel-player1 .panel-footer').html('');
		$('#choices').remove();
		$('#message').html('');
	}
	if(snapshot.child('2').exists()){
		player2 = snapshot.child('2').val();
		$('#panel-player2 .panel-body h4').html(player2.name);
		$('#panel-player2 .panel-footer').html('Wins: ' + player2.wins + ' Losses: ' + player2.losses);
	}
	else{
		$('#panel-player2 .panel-body h4').html('Waiting for Player 2');
		$('#panel-player2 .panel-footer').html('');
		$('#choices').remove();
		$('#message').html('');
	}
});
refTurns.on('value', function(snapshot){
	turn = snapshot.val();
	if(turn===3){
		sessionStorage.setItem('turn', 1)
		$('#panel-player1').find('h3').html(player1.choice);
		$('#panel-player2').find('h3').html(player2.choice);
		checkMoves();
	}
	else {
		if(snapshot.val()!==null){
			sessionStorage.setItem('turn', turn);
		}
		if(snapshot.val()==sessionStorage.getItem('player')){
			$('#message').html('<p>It\'s your turn!</p>');
			$('#choices').remove();
			$('.panel-mainScreen .panel-body h3').html('');
			$('#panel-player' + sessionStorage.getItem('player')).find('.panel-body').append('<div id="choices" class="btn-group-vertical" role="group"></div>');
			for(i=0; i<choices.length;i++){
				$('#choices').append('<div class="btn-group" role="group"><button type="button" class="btn btn-default choices">' + choices[i] + '</button></div>');
			}
		}
		else if(sessionStorage.getItem('player')!=='undefined' && snapshot.val()){
			refPlayers.once('value', function(snapshot){
				opponent = snapshot.child(turn).val();
				if(opponent!==null){
					$('#message').html('<p>Waiting on ' + opponent.name + ' to make a move!</p>');
				}
			});
			
		}
	}	
});
$('#startBtn').on('click', function(event){
	event.preventDefault();
	name = $('#playerName').val().trim();
	wins = 0;
	losses = 0;
	refPlayers.once('value', function(snapshot){
		var data;
		if(!snapshot.hasChild('1')){
			data = {
				1: {
					name: name,
					wins: wins,
					losses: losses
				}
			};
			playerNumber = 1;
			if(snapshot.hasChild('2')){
				refTurns.set(1);
				sessionStorage.setItem('player', playerNumber)
				$('#panel-player' + sessionStorage.getItem('player')).find('.panel-body').append('<div id="choices" class="btn-group-vertical" role="group"></div>');
				for(i=0; i<choices.length;i++){
					$('#choices').append('<div class="btn-group" role="group"><button type="button" class="btn btn-default choices">' + choices[i] + '</button></div>');
				}
			}
		}
		else if(!snapshot.hasChild('2')){
			data = {
				2: {
					name: name,
					wins: wins,
					losses: losses
				}
			};
			playerNumber = 2;
			refTurns.set(1);
		}
		else {
			data = {
				anon: {
					name: name
				}
			};
		}
		sessionStorage.setItem('name', name);
		sessionStorage.setItem('wins', wins);
		sessionStorage.setItem('losses', losses);
		sessionStorage.setItem('turn', 1);
		sessionStorage.setItem('player', playerNumber)
		refPlayers.update(data)
	});
	if(playerNumber){
		$('#messageToClient').empty().addClass('panel panel-default').append('<div class="panel-body text-center">Hi ' + name + ' you are Player ' + playerNumber + '</div><p id="message"></p>');
		if(sessionStorage.getItem('player')==='2'){
			$('#message').html('<p>Waiting on ' + opponent.name + ' to make a move!</p>');
		}
	}
	else {
		$('#messageToClient').empty().addClass('panel panel-default').append('<div class="panel-body text-center">Hi ' + name + ' you are a Spectator</div>')
	}
});
$(document).on('click', '.choices', function(event){
	event.preventDefault();
	playerChoice = $(this).html();
	$(this).closest('#choices').parent().find('h3').html(playerChoice);
	$(this).closest('#choices').remove();
	if(sessionStorage.getItem('player') ==='1' && turn===1){
		refPlayers.child(1).update({choice: playerChoice});
		refTurns.set(2);
	}
	else if(sessionStorage.getItem('player') ==='2' && turn===2) {
		refPlayers.child(2).update({choice: playerChoice});
		refTurns.set(3);
	}
	sessionStorage.setItem('choice', playerChoice);
});
//makes sure to append all messages and automatically scrolls to last message
refChat.on('child_added', function(snapshot){
	$('#panel-chat').find('.panel-body').append('<p>'+snapshot.val()+'</p>');
	$("#panel-chat .panel-body").scrollTop($("#panel-chat .panel-body")[0].scrollHeight);
	console.log('here')
});
refChat.on('child_changed', function(snapshot){
	console.log('hereee')
	$('#panel-chat').find('.panel-body').append('<p>'+snapshot.val()+'</p>');
	$("#panel-chat .panel-body").scrollTop($("#panel-chat .panel-body")[0].scrollHeight);
})
$(document).on('click', '#chatBtn', function(){
	event.preventDefault();
	var messenger;
	if(sessionStorage.getItem('name')===null){
		messenger = 'Anon';
	}
	else {
		messenger = sessionStorage.getItem('name');
	}
	var chatMessage = $('#chatMessage').val().trim();
	var messageToSend = messenger + ": " + chatMessage;
	refChat.push(messageToSend);
})
//makes the comparison between both players
function checkMoves(){
	var player1Outcome;
	var player1Wins = player1.wins;
	var player1Losses = player1.losses;
	var player2Wins = player2.wins;
	var player2Losses = player2.losses;
	if(player1.choice === player2.choice){
		$('#panel-outcome').find('h4').html('TIE');
	}
	else if(player1.choice === 'Rock'){
		if(player2.choice === 'Paper'){
			player1Outcome = false;
		}
		else {
			player1Outcome = true;
		}
	}
	else if(player1.choice === 'Paper'){
		if(player2.choice === 'Scissors'){
			player1Outcome = false;
		}
		else {
			player1Outcome = true;
		}
	}
	else {
		if(player2.choice === 'Rock'){
			player1Outcome = false;
		}
		else {
			player1Outcome = true;
		}
	}
	if(player1Outcome && player1.choice !== player2.choice){
		player1Wins++;
		player2Losses++;
		$('#panel-outcome').find('h4').html(player1.name + ' Wins');
		refPlayers.child(1).update({wins: player1Wins});
		refPlayers.child(2).update({losses: player2Losses});
	}
	else if(player1.choice !== player2.choice) {
		player2Wins++
		player1Losses++
		$('#panel-outcome').find('h4').html(player2.name + ' Wins');
		refPlayers.child(2).update({wins: player2Wins});
		refPlayers.child(1).update({losses: player1Losses});
	}
	if(sessionStorage.getItem('player')==='1'){
		sessionStorage.setItem('wins', player1.wins)
		sessionStorage.setItem('losses', player1.losses)
	}
	else if(sessionStorage.getItem('player')==='2'){
		sessionStorage.setItem('wins', player2.wins)
		sessionStorage.setItem('losses', player2.losses)
	}
	//waits five seconds before clearing the outcome and panel-player screens
	setTimeout(function(){
		refTurns.set(1);
		$('#panel-player1').find('h3').html('');
		$('#panel-outcome').find('h4').html('')
		$('#panel-player2').find('h3').html('');
	}, 5000)
}




