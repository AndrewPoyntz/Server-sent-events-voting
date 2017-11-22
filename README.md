# Server-sent-events-voting
simple node server and app to vote and show the results using server sent events
also includes a tic-tac-toe game on /game

## To use:

* ``` npm install```
* Create a self signed certificate - you need 'server.crt' and 'server.key' in the root([how?](https://www.akadia.com/services/ssh_test_certificate.html)), or use a real one...
* ``` npm run dev```
* Go to https://localhost
* open the same url in a different browser, 
* vote in one of the browsers and see it magically update in the other
* /admin lets you administer the vote (change the options etc) - clients will get an update whe you do this
* /game contains a tic-tac-toe game, requires 2 clients to pick their side, then any other clients are observers of the game with realtime updates
