const accountSid = 'AC4a19c3b56443a134971980fb3829220d';
const authToken = '1064e991c0c49cc3b02158574eeaf74d';
const serviceId = 'VA39e87103e4bc52e3ac228cc086c80a86';


module.exports={
    Sms:(Phone)=>{
        const client = require('twilio')(accountSid, authToken);
        client.verify.v2.services(serviceId)
        .verifications
        .create({to: `+91${Phone}`, channel: 'sms'})
        .then(verification => console.log(verification.status));
    },      
    verify:(Phone,code)=>{
        return new Promise ((resolve,reject)=>{
                const client = require('twilio')(accountSid, authToken);
          client.verify.v2.services(serviceId)
          .verificationChecks
          .create({to: `+91${Phone}`, code:code})
          .then(verification_check => {console.log(verification_check.status)
            if(verification_check.status==="approved"){
                resolve(true)
              }else{
                resolve(false)
              }
        })
        })
       
    }
}



