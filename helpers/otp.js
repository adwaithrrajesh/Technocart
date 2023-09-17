const accountSid = 'AC4a19c3b56443a134971980fb3829220d';
const authToken = 'a6c79ea2a5b512d4f16e2e1f6c3d5da8';
const serviceId = 'MG311492ef817c85b5969acccfaf0b2de6';


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



