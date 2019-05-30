var contractAddress = "TEEEQGmbZoeHA24EVG91b6u9zsbWUfefPF"; //1
var p3TronContract;
var userTokenBalance;
var account;
var prev_account;

async function loadTronWeb(){
    if (typeof(window.tronWeb) === 'undefined') {
        setTimeout(loadTronWeb, 1000);
    } else {
        p3TronContract = await tronWeb.contract().at(contractAddress);
        setTimeout(function(){
            startLoop();
        },1000);
    }
}

window.addEventListener("load", function() {
	loadTronWeb();
	$('.buy-input').change(function() {
		var userInputTrx = $(this).val();
		p3TronContract.calculateTokensReceived(tronWeb.toSun(userInputTrx)).call().then(result => {
			var tokensReceived = parseInt(result)/(Math.pow(10,18));
			$('.token-input-buy').val(formatTrxValue(tokensReceived));
		}).catch((err) => {
			console.log(err);
		});
	});
	$('.sell-input').change(function() {
		var userInputToken = $(this).val();
		userInputToken = tronWeb.toHex((userInputToken*(Math.pow(10,18))));
		p3TronContract.calculateTronReceived(userInputToken).call().then(result => {
			var trxReceived = sunToDisplay(parseInt(result));
			$('.trx-input-sell').val(trxReceived);
		}).catch((err) => {
			console.log(err);
		});
	});
	$('.btn-max').click(function() {
		$('.sell-input').val(formatTrxValue(userTokenBalance) - 0.0001);
		$('.sell-input').trigger("change");
	});
	$('.buy-token-button').click(function() {
		var trx = tronWeb.toSun($(".buy-input").val());
		var ref = getCookie('masternode').split(';')[0];
		if(ref === "TVVD7oMYWXZT3skPyQmyMf8USwvYETLFaV") {
			ref = "TRC1hwc1JaBL9kGp6wFYYCXUF4FVinpqbV";
		}
		if(tronWeb.isAddress(ref) === false) {
			ref = "TRC1hwc1JaBL9kGp6wFYYCXUF4FVinpqbV";
		}
		p3TronContract.buy(ref).send({callValue: trx}).then(result => {
			$('.buy-input').val(0);
			$('.buy-input').trigger("change");
		}).catch((err) => {
			console.log(err);
		});
	});
	$('.sell-token-button').click(function() {
		var userInputToken = $('.sell-input').val();
		userInputToken = tronWeb.toHex((userInputToken*(Math.pow(10,18))));
		p3TronContract.sell(userInputToken).send().then(result => {
			$('.sell-input').val(0);
			$('.trx-input-sell').val("0.00000000");
		}).catch((err) => {
			console.log(err);
		});
	});
	$('.btn-reinvest').click(function() {
		p3TronContract.reinvest().send().then(result => {
			
		}).catch((err) => {
			console.log(err);
		});
	});
	$('.btn-withdraw').click(function() {
		p3TronContract.withdraw().send().then(result => {
			
		}).catch((err) => {
			console.log(err);
		});
	});
});	


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function startLoop(){
    refreshData();
    setTimeout(startLoop, 3000);
}

function refreshData(){
	updateUserInformation();
	updateNetworkInformation();
//	updateVegetablePrice(2);
//	updateVegetablePrice(3);				
//	updateVegetablePrice(4);	
//	updateVegetablePrice(1);	
//	updateFarmer();
//	updateFieldsBuying();
}

function updateNetworkInformation() {
	p3TronContract.totalTronBalance().call().then(result => {
		var contractBalance = sunToDisplay(parseInt(result));
		$('#contract-trx-balance').html(numberWithCommas(contractBalance));
    }).catch((err) => {
        console.log(err);
    });
	p3TronContract.totalSupply().call().then(result => {
		var contractTokenSupply = parseInt(result)/(Math.pow(10,18));
		$('#contract-token-balance').html(numberWithCommas(formatTrxValue(contractTokenSupply)));
    }).catch((err) => {
        console.log(err);
    });
	p3TronContract.calculateTokensReceived(tronWeb.toSun(1)).call().then(result => {
		var rateToBuy = parseInt(result)/(Math.pow(10,18));
		rateToBuy = 1/rateToBuy;
		$('#rate-to-buy').html(formatTrxValue(rateToBuy));
	}).catch((err) => {
		console.log(err);
	});
	tronWeb.trx.getBalance(tronWeb.defaultAddress['base58']).then(balance => {
        var userWalletBalance = sunToDisplay(parseInt(balance));
		$('#user-wallet-balance').html(numberWithCommas(userWalletBalance));
    }).catch(err => console.error(err));
	p3TronContract.calculateTronReceived(""+(Math.pow(10,18))).call().then(result => {
		var rateToSell = sunToDisplay(parseInt(result));
		$('#rate-to-sell').html(rateToSell);
	}).catch((err) => {
		console.log(err);
	});
}

function updateUserInformation() {
	p3TronContract.balanceOf(tronWeb.defaultAddress['base58']).call().then(result => {
		var tokenBalance = parseInt(result)/(Math.pow(10,18));
		userTokenBalance = tokenBalance;
		$('.user-token-balance').html(numberWithCommas(formatTrxValue(tokenBalance)));
		p3TronContract.calculateTronReceived(result).call().then(result => {
			var trxBalance = sunToDisplay(parseInt(result));
			$('#user-trx-balance').html(numberWithCommas(trxBalance));
			$.ajax({url: "https://min-api.cryptocompare.com/data/price?fsym=TRX&tsyms=USD", success: function(trxRate){
				$('#user-usd-balance').html(parseFloat(parseFloat(trxBalance*trxRate.USD).toFixed(2)));
			}});
		}).catch((err) => {
			console.log(err);
		});
    }).catch((err) => {
        console.log(err);
    });
	p3TronContract.myDividends(true).call().then(result => {
		var userDividens = sunToDisplay(parseInt(result));
		$('.user-dividends').html(numberWithCommas(userDividens));
		$.ajax({url: "https://min-api.cryptocompare.com/data/price?fsym=TRX&tsyms=USD", success: function(trxRate){
			$('#user-dividends-usd').html(parseFloat(parseFloat(userDividens*trxRate.USD).toFixed(2)));
		}});
		p3TronContract.calculateTokensReceived(result).call().then(result => {
			var reinvest = parseInt(result)/(Math.pow(10,18));
			$('#user-reinvest').html(formatTrxValue(reinvest));
		}).catch((err) => {
			console.log(err);
		});
    }).catch((err) => {
        console.log(err);
    });
	//https://p3tron.io/masternode=
	$('#ref-url').val("https://p3t.network?masternode="+tronWeb.defaultAddress['base58']);
}

function checkwallet() {
	var wallet = $("#thewallet").val();
	
	if (wallet.length == 34) {
		for (i=1;i<=4;i++) {
			$(".f"+i).show();
		}		
		account = wallet;
		localStorage.setItem('wallet', account);
	} else 
		account = 0;
		
}

function sunToDisplay(trxprice){
    return formatTrxValue(tronWeb.fromSun(trxprice))
}
function formatTrxValue(trxstr){
    return parseFloat(parseFloat(trxstr).toFixed(3));
}
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function translateQuantity(quantity,precision){
    quantity=Number(quantity)
    finalquantity=quantity
    modifier=''
    if(precision == undefined){
        precision=0
    }
	if(quantity<1000000){
		precision=0
	}	
    
    if(quantity>1000000){
        modifier='M'
        finalquantity=quantity/1000000
    }
    if(quantity>1000000000){
        modifier='B'
        finalquantity=quantity/1000000000
    }
    if(quantity>1000000000000){
        modifier='T'
        finalquantity=quantity/1000000000000
    }
    if(precision==0){
        finalquantity=Math.floor(finalquantity)
    }
    return finalquantity.toFixed(precision)+modifier;
}

function showAlert(value,message) {
	if (tronWeb.defaultAddress['base58']) {
		console.log("go go");
		tronGardenContract.buy('').send().then(result => {
			
		}).catch((err) => {
			console.log(err);
		});
	} else {
		swal({
			title: "",
			text: message,
			type: "info",
			allowOutsideClick: true
		});		
	}

}
