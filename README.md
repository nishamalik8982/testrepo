# testrepo

Latest working updates:
  - Possibility to create bitcoin address
  - Possibility to send and receive payments in bitcoin wallet
  
Testing steps 
phase 1: create address:
  - clone the repo
  - run the app (npm start or whatever)
  - go to http://localhost:3000
  - take the path wallet/bitcoin
  - click on "create new" and fill the form
  - Congratulations!!! now don't try to send money somewhere cause there's none
  - check the file /db/wallets.db, it contains the address we just created (everything is encrypted except the public key). Save the whole content somewhere, we'll need it later
  
phase 2: get some money:
  - check the file ./wallets_with_money.txt
  - copy the whole content (it's just a wallet with some money inside)
  - paste it inside the file /db/wallets.db, but remove the empty address first
  - restart the app (important!)
  - take the path wallet/bitcoin again and you should see the wallet with some transactions and some credit in it
  - if so, click the P button and fill the form with the empty address you saved somewhere in the previous phase
  - hit the "send payment button" and the transaction should appear below
  - congrats again!! check the link https://live.blockcypher.com/btc-testnet/ and insert the address, hash or whatever to see the status of the transaction
  
