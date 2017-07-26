// Initialize Firebase
var config = {
apiKey: "AIzaSyDMGmU6sAF0gsqozNxxspZVOmE9I7j-e9Y",
authDomain: "rockpaperscissors-430d4.firebaseapp.com",
databaseURL: "https://rockpaperscissors-430d4.firebaseio.com",
projectId: "rockpaperscissors-430d4",
storageBucket: "",
messagingSenderId: "954071881956"
};
firebase.initializeApp(config);
//Creating an instance of firebase to reference
var database = firebase.database();
var refPlayers = database.ref('players');
var players = false;
//Getting a snapshot of the local data
//This function allows me to update the page in real-time by adding the 'value' event listener
refPlayers.on('value', function(snapshot){
	console.log(snapshot);
	//This checks if there is already data
	//If there is then player will now equal 2
	if(snapshot.val()){
		players = true;
		console.log(players);
	}
});
//This function will update the database with the name of the player 
$('#startBtn').on('click', function(event){
	event.preventDefault();
	//This declares playerName to be the input value
	var playerName = $('#playerName').val().trim();
	// I create an object that will hold his info and pass it on to firebase
	if (!players){
		var playerData = {
			1: {
				lossess: 0,
				name: playerName,
				wins: 0
			}
		}
	}
	else {
		var playerData = {
			2: {
				lossess: 0,
				name: playerName,
				wins: 0
			}
		}
	}
	
	//This sets the first player firebase
	refPlayers.update(playerData);

})

