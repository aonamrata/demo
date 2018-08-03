'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');
const MSG = require('../models/messages');
const SFLAKE = require('../models/snowflake-connection');
const sprintf = require('sprintf-js').sprintf;

const config = {
    logging: true,
};

const app = new App(config);

// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.tell(MSG.launch);
    },

    'CountsArtistByCountry': function(country) {
        var _self = this;
        console.log('\n------------------------------\n');
        console.log(country);
        var country_code = country.key;

        SFLAKE.getArtistInCountry(country_code).
            then(function(data) {
                console.log('data==');
                console.log(data);
                var message = MSG.NoDataFound;
                if (data != false) {
                    var message = sprintf(MSG.successArtistByCountry, {
                        count: data['COUNTS'],
                        country: country.value,
                        artist: data['ARTISTID'],
                    });
                }
                _self.tell(message);
                
            }).catch(function(err) {
                console.log('**ERROR HANDLER**');
                console.log(err);
                _self.tell('SOME ERROR');
            });
   
    },

    'Unhandled': function() {
        this.toIntent('LAUNCH');
    },
    'END': function() {
        // Triggered when a session ends abrupty or with AMAZON.StopIntent
        this.tell('end');
    },
});

module.exports.app = app;
