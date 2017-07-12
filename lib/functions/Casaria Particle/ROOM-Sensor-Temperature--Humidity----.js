// name: ROOM Sensor Temperature, Humidity, ..
// outputs: 4
/*
Process the IOT node message stream subscribed by SSE from
particle or casaria cloud. Multiple values are packed into one
message separated by '&' to minimize packet size and overhead
(cost for 3G as well)

Output(s):
JSON message with raw plausiblity checked sensor data for storage 
to Time Series Database (TSDB) InfluxDB.

Several new messages with distinct value payloads
for further processing (i.e control, alerting, tweets, generate HTML psges,
, User Interface, etc,)

*/
var s = msg.payload;
var fields = s.split('&');
var msg1, msg2, msg3, msg4;
var pcolor, color;
msg1 = {};
msg2 = {};
msg3 = {};
msg4 = {};
color = fields[2];

if (color != context.flow.casaria.LHS.COLOR)
{
    
} else {
    color = "WHITE";    //populate with default 
}
msg4.payload = {
    topic: "color",
    COLOR: context.flow.casaria.LHS.COLOR,
    CUR_COLOR: color, 
}
context.flow.casaria.LHS.COLOR = color;

//plausibility checks, no DHT sensor read => 2.0 is read
if (isNaN (fields[0]) || isNaN(fields[1])) return [msg1,msg2]

//if (Number(fields[0])<=2.0) fields[0] = '0.0';

msg1.payload = {
    time: Date.parse(msg.published_at),
    Ambient: Number (fields[0]) -0.0,
    Humidity:  Number ( fields[1]),
    Color: color,
    strValue: "LHLAX-SENS-S",
    metric: Number (fields[0]) - 0.0,
    geohash: "9q5c1dcs168d",
}
msg2 = {
    topic: "Temp",
    payload: Number (fields[0]) -0.0,
}
msg3 = {
    topic: "Humidity",
    payload: Number (fields[1]) 
}
return [msg1,msg2, msg3, msg4];