var url = "http://localhost:4000/graphql";

// Production normal dist values
var consumption_mean = 20;
var consumption_dev = 2;
// Wind for year normal dist values
var wind_mean_year = 5;
var wind_dev_year = 1;
// Wind per day normal dist values (mean per day changes)
var wind_mean_day = 5;
var wind_dev_day = 0.5;

console.log(wind_mean_day);
updateWindDay();
console.log(wind_mean_day);

for(i= 0; i < 24; i++){
    console.log(updateWind());
}

function updateWindDay(){

    var z = boxMullerTransform();

    wind_mean_day = wind_mean_year + wind_dev_year * z
}

function updateWind(){
    var z = boxMullerTransform();

    wind = wind_mean_day + wind_dev_day * z;
    return wind;
}

function updateConsumption(){
    var z = boxMullerTransform();

    consumption = consumption_mean + consumption_dev * z;
    return consumption;
}

function boxMullerTransform(){
    var u1 = Math.random();
    var u2 = Math.random();
    
    var z = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
    return z;
}
