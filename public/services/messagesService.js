'use strict'

var messagesService = angular.module('messagesService', []);

messagesService.factory('messagesService', function() {
	return {
		messages: {
	        "Bad Password" : "Niet ingelogd. Incorrecte gebruikersnaam of wachtwoord. Probeer opnieuw.",
	        "login": "login",
	        "register": "registreer",
	        "registerSuccess": " was successvol aangemaakt",
	        "alreadyRegistered": " is al in gebruik!"			
		}
	}
});