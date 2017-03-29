// stellar.js
//var StellarSdk = {};

function InitStellar() {
    console.log(StellarSdk);
    //StellarSdk = window.stellarSdk;
    server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    StellarSdk.Network.useTestNetwork();
}


function LoadBalance(playerString) {
    StoreWager();
    var acctid = document.getElementById(playerString + 'Account').value;

    if (acctid) {
        var sMessage = "Getting XLM Balance for " + playerString + ": " + acctid;
        PrintOutput(sMessage);

        server.loadAccount(acctid).then(function(account) {
            //console.log('Balances for account: ' + acctid); //pair.accountId());
            window[playerString + 'Account'] = account;

            account.balances.forEach(function(balance) {
                //console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
                if (balance.asset_type == 'native') {
                    document.getElementById(playerString + 'Balance').value = balance.balance;
                    window[playerString + 'Balance'] = balance.balance;
                    enablePlayer(playerString);
                }
            });
        }).catch(StellarSdk.NotFoundError, function(error) {
            // Account NotFoundError
            disablePlayer(playerString);

            throw new Error('The destination account does not exist!');
        }).catch(console.log.bind(console));
    }
}


function PayWinner(from, to, amt) {
    //if (from != null && to != null && amt > 0) {
    var sResult = from + " pays " + to + ": " + amt + " XLM";
    //}

    disablePlayer(from);
    disablePlayer(to);

    var fromAcct = window[from + 'Account'];
    var payment = {
        destination: window[to + 'Account'].id,
        asset: StellarSdk.Asset.native(),
        amount: window.wager
    };
    var sourceKeys = StellarSdk.Keypair.fromSecret(document.getElementById(from + 'Signer').value);

    console.log(sourceKeys);
    var transaction = new StellarSdk.TransactionBuilder(fromAcct)
        .addOperation(StellarSdk.Operation.payment(payment))
        .addMemo(StellarSdk.Memo.text('Rock, Paper, Scissors Win!'))
        .build();

    // Sign the transaction to prove you are actually the person sending it.
    transaction.sign(sourceKeys);

    server.submitTransaction(transaction).then(function(result) {
            console.log('Success! Results:', result);
            LoadBalance(from);
            LoadBalance(to);
        })
        .catch(function(error) {
            console.error('Something went wrong!', error);
            LoadBalance(from);
            LoadBalance(to);
        });

    return sResult;
}