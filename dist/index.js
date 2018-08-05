'use strict';

var _FirePower = require('./FirePower');

var addHostOptions = {
    domainUUID: 'e276abec-e0f2-11e3-8169-6d9ed49b625f',
    objectName: 'SOC3D_4.4.4.4',
    host: '4.4.4.4'
};

var newAccessPolicyOptions = {
    domainUUID: 'e276abec-e0f2-11e3-8169-6d9ed49b625f',
    policyUUID: '005056AE-C9B6-0ed3-0000-025769804678',
    hostObjectName: 'SOC3D_incoming_4.4.4.4',
    hostObjectID: '005056AE-C9B6-0ed3-0000-025769805144',
    accessRuleName: 'Test 777 name'
};
console.log('Started');

var fire = new _FirePower.FirePower('192.168.200.66', 'admin', 'P@ssw0rd');
fire.connect().then(function () {
    return fire.addHostObject(addHostOptions);
}).catch(function (ex) {
    return console.log(ex);
})
//.then(() => (fire.blockIncomingConnectionForHost(newAccessPolicyOptions)))
//.catch((ex)=>(console.log(ex)))
.then(function () {
    return fire.blockOutgoingConnectionForHost(newAccessPolicyOptions);
}).catch(function (ex) {
    return console.log(ex);
});