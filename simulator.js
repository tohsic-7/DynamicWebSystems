var resolvers = require('./simulator/graphql/resolvers/index')
var mongoose = require('mongoose');
const prosumer = require('./models/prosumer');
const { updateProsumer } = require('./simulator/graphql/resolvers/index');
var url = "mongodb://localhost:27017/grid";


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: true});

// Production normal dist values
var consumption_mean = 350;
var consumption_dev = 20;
// Wind for year normal dist values
var wind_mean_year = 7;
var wind_dev_year = 1;
// Wind per day normal dist values (mean per day changes)
var wind_mean_day = 7.5;
var wind_dev_day = 0.5;

//Wind turbine specs
var sweap_area = 6;
var air_density = 1.23

var startup_timer = 0;


run();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function run(){
    while(true){

        updateWindDay();

        for(i=0; i<24; i++){

            await sleep(3000);
            var prosumers = await resolvers.getProsumers();

            // "simulated hour of the system"

            var grid_electricity = 0;
            var grid_consumption = 0;

            // ------------------------- calculate prosumer impact on the grid
            for(pro of prosumers){

                // update wind

                var new_wind = updateWind();

                // calculate produced electricity

                var produced = calcProduction(new_wind);

                // update consumption

                var consumed = updateConsumption();


                // calculate electricity to battery and to grid if excessive production

                var excess = produced - consumed;
                if(excess >= 0){
                    var consumed_from_grid = 0

                    var electricity_to_battery = pro.buffer + excess * pro.ratio_excess/100; //The new amount of electricity in the battery


                    //Check if new amount is larger than maximum and if so send the rest to the grid
                    if(electricity_to_battery>pro.buffer_size){ 
                        var electricity_battery = pro.buffer_size;
                        grid_electricity += electricity_to_battery - pro.buffer_size;
                    } else{
                        var electricity_battery = electricity_to_battery;
                    }

                    grid_electricity +=  excess * (1 - pro.ratio_excess/100);

                }

                // calculate amount of electricity taken from battery and grid if under production
                else{
                    //add functionality if battery is 0
                    var difference = consumed - produced;
                    var consumed_from_grid = difference * (1-(pro.ratio_under/100));

                    var electricity_to_battery = pro.buffer - (difference * pro.ratio_under/100);
                    
                    //If electricity to battery is less than zero set buffer to 0 and the rest goes as grid consumption.
                    if (electricity_to_battery < 0){
                        
                        consumed_from_grid += 0 - electricity_to_battery;
                        var electricity_battery = 0; 
                    }

                    else{
                        var electricity_battery = electricity_to_battery;
                    }
                    grid_consumption += consumed_from_grid
                }




                await resolvers.updateProsumer({_id: pro._id, wind: new_wind , buffer: electricity_battery, production: produced, consumption: consumed, consumed_from_grid: consumed_from_grid});
            }

            // ---------------------------- caluclate consumer impact on the grid

            var consumers = await resolvers.getConsumers();

            for(con of consumers){
                var consumed = updateConsumption();
                grid_consumption += consumed;

                await resolvers.updateConsumer({_id: con._id, consumption: consumed})
            }

            // ---------------------------- calculate manager / coal plant impact on grid

            var manager = await resolvers.getManagers();

            for (man of manager){
                let timer = man.timer;
                // if status running return maximum production from coal plant and ratio to buffer
                if (man.status == "running"){
                    var produced = coalProduction(10, man.production_cap);
                    var new_buffer = man.buffer + produced * (man.ratio/100);
                    if(new_buffer > man.buffer_size){
                        new_buffer = man.buffer_size;
                    }
                    var produced = produced * (1-(man.ratio/100));
                }
                // if status is starting return increasing production over time
                else if(man.status == "starting"){
                    var produced = coalProduction(timer, man.production_cap);
                    var new_buffer = man.buffer + produced * (man.ratio/100);
                    if(new_buffer > man.buffer_size){
                        new_buffer = man.buffer_size;
                    }
                    var produced = produced * (1-(man.ratio/100));
                    timer += 1;
                    if (timer >= 10){
                        status = "running";
                        await resolvers.updateManager({_id: man._id, status: status});
                    }
                }
                //if status is stopped decreasing production over time
                else if(man.status == "stopped"){
                    if(timer>0){
                        timer -= 1;
                        var produced = coalProduction(timer, man.production_cap);
                    }  else{
                        var produced = 0;
                    }
                    
                    var grid_require = grid_consumption - grid_electricity;

                    // If grid is not getting enough electricity use buffer
                    if(produced < grid_require){
                        grid_require -= produced;
                        if(man.buffer>0){
                            if(grid_require > man.buffer){
                                produced += man.buffer;
                                var new_buffer = 0;
                            } else{
                                produced += grid_require;
                                var new_buffer = man.buffer - grid_require;
                            }

                        }

                    }
                }
                let price;
                let modelledPrice = calcModelledPrice(grid_consumption, wind_mean_day);
                if(man.price_bool){
                    price = modelledPrice;
                }else{
                    price = man.price;
                }
                await resolvers.updateManager({
                    _id: man._id,
                    production: produced,
                    buffer: new_buffer,
                    demand: grid_consumption,
                    timer: timer,
                    price: price,
                    modelled_price: modelledPrice
                }); 


                grid_electricity += produced;
            }

            //use electricity in grid to distribute to users.
            
            blackouts(grid_electricity);
            

        }
    }
}   


// calculate electricity produced from windmill
function calcProduction(wind){
    return((1/2)*air_density*sweap_area*(wind**3)*0.4);
}

// updates wind mean for the day using gaussian distribution
function updateWindDay(){

    var z = boxMullerTransform();

    wind_mean_day = wind_mean_year + wind_dev_year * z
}
// update wind for prosumer using gaussian distribution
function updateWind(){
    var z = boxMullerTransform();

    wind = wind_mean_day + wind_dev_day * z;
    return wind;
}

// updates consumption for consumer and prosumer
function updateConsumption(){
    var z = boxMullerTransform();

    consumption = consumption_mean + consumption_dev * z;
    return consumption;
}

// Takes uniformly distributed random numbers and creates a z that can be used in gaussian distribution
function boxMullerTransform(){
    var u1 = Math.random();
    var u2 = Math.random();
    
    var z = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
    return z;
}

function coalProduction(t, pc){
    if(pc !== 0 && (2.4**t)>pc){
        return pc;
    }
    return (2.4**t);
}

function calcModelledPrice(consumption, wind){
    var modelledPrice = 0.6*(7.5/wind)*(consumption/2000);
    return modelledPrice;
}

// Distributes grid electricity randomly between houses and those who cannot sustain their consumption get blackout
async function blackouts(grid_electricity){

    var prosumers = await resolvers.getProsumers();
    var consumers = await resolvers.getConsumers();

    // randomizes the lists of prosumers and consumers
    var shuffled_prosumers = prosumers.sort(() => Math.random() - 0.5)
    var shuffled_consumers = consumers.sort(() => Math.random() - 0.5)

    var p_index = 0;
    var c_index = 0;

    // Randomizes if prosumer or consumer should get electricity
    for(i=0; i<(prosumers.length + consumers.length); i++){
        if(((Math.random() == 0) && p_index < shuffled_prosumers.length) || c_index >= shuffled_consumers.length){
            var prosumer = shuffled_prosumers[p_index];
            p_index += 1;

            // If prosumer production is more than consumption no blackout
            if(prosumer.production - prosumer.consumed_from_grid>0){
                blackout_bool = false;
            }
            // If there is enough electricity on the grid for prosumer consumption no blackout. If not blackout
            else if((grid_electricity - prosumer.consumed_from_grid) >=0 ){
                grid_electricity -= prosumer.consumed_from_grid;
                blackout_bool = false;
            } else{
                blackout_bool = true;
            }
            await resolvers.updateProsumer({_id: prosumer._id, blackout: blackout_bool})
        } else{
            var consumer = shuffled_consumers[c_index];
            c_index += 1;

            // If there is enough electricity on the grid give it to consumer. If not blackout
            if(grid_electricity-consumer.consumption>=0){
                grid_electricity -= consumer.consumption;
                blackout_bool = false;
            } else{
                blackout_bool = true;
            }
            await resolvers.updateConsumer({_id: consumer._id, blackout: blackout_bool})
        }
    }
    
}