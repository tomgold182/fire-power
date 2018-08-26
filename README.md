# fire-power
## fire-power is an easy-to-use Cisco FirePower client. 
##How To:
Just NPM install and import the FirePower Class
### Examples:
Connection:

```
var firePowerClient = new FirePower('1.1.1.1','user','pass')
```

usage:
```
var HostOptions= {
    domainUUID: 'e276efc-e0f2-11e3-8169-88872ef',
    objectName: 'test_4.4.4.4',
    host: '4.4.4.4'
}
var firePowerClient = new FirePower('1.1.1.1','user','pass')
    fire.connect()
    .then(() => (fire.addHostObject(HostOptions)))
    .catch((ex)=>(console.log(ex)))

```

Full usage example can be found at the Index.js file

Feel free to contribute!
