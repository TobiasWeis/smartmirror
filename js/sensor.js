/*
 * calls a php function with ajax to check a sensor
 * or some other stuff
 */
var sensor = {
    start: function(){
        this.update();

        setInterval(function() { 
            this.update();
        }.bind(this), config.sensor.refreshIntervalMs);
    },

    update:function(){
        $.ajax({
            type:"GET",
            url: "php/get_sensor.php",
            dataType: 'json',
            success:function(result){
                /* do nothing */
            }
        })
    }
}
