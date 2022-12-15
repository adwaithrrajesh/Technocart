const accountSid = 'AC24d706fe8e3b4be73ada300bc0d3bcca';
const authToken = 'b64d10304f90c3410ae14b9b13a74f26';
const serviceId = 'VA76785e589f3db63770a0b47308405eb4';


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
            console.log(code)
            console.log(Phone)
            return new Promise((res,rej)=>{
                const client = require('twilio')(accountSid, authToken);
          client.verify.v2.services(serviceId)
          .verificationChecks
          .create({to: `+91${Phone}`, code:code.otp_code})
          .then(verification_check => {console.log(verification_check.status)
            if(verification_check.status==="approved"){
                resolve(true)
              }else{
                resolve(false)
              }
        })
            })
        })
       
    }
}



