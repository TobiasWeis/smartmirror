/*
 * class bitcoin api to get current exchange rate 
 */
var bitcoin = {
    start: function(){
        this.update();

        setInterval(function() { 
            this.update();
        }.bind(this), config.bitcoin.refreshIntervalMs);
    },

    update:function(){
        $.ajax({
            type:"GET",
            url: "php/get_bitcoin.php",
            dataType: 'text',
            success:function(result){
                var obj = JSON.parse(result);
                rate=Math.round(obj.rate_weighted*100) / 100;

                $("#bitcoin-widget").html("BTC: " + rate);
            }
        })
    }
}
