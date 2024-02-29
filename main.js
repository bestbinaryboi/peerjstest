let peer;
let connout;
let connin;
let data2="sigma";
let myid;
let connectcode=Math.floor(Math.random()*1000);
let pingaverage=[];
let ping=0;
let pingpoint;
let p1x=0;
let p1y=0;
let p2x=0;
let p2y=0;
let username="unknown";
let username2="unknown";
let connected=false;
let lastx;
let lasty;
let usernametextbox;
let lastsecpacket;
let OnMoblie=false;
let debugMode=false;
function preload(){
}
function averageList(inList){
    let outnum=0;
    for (i=0;inList.length<i;i++){
        outnum+=inList[i]
    };
    return outnum/inList.length;
}
function setup() {
  
  createCanvas(400, 400);
  background(100)
  text("Enter Username:",150,180)
  usernametextbox=createInput()
  usernamebutton=createButton("Ok")
  usernametextbox.position(150,200)
  usernamebutton.position(250,200)
  usernametextbox.size(100,20)
  usernamebutton.size(40,20)
  usernametextbox.stage=1
  setuppeer()
  usernamebutton.mouseClicked(textBoxEnter);

}
function setuppeer(){
      peer = new Peer("bad-productions-uuid-domain-app-01-"+connectcode);
  peer.on('open',function(id){
      console.log("connection open with id:"+id);
      myid=id;
      redraw();
  })
  peer.on('connection',function(connection){
      connin=connection;
      connected=true;
      usernametextbox.remove()
      usernamebutton.remove()
      connin.on('data', function(data){
          proccespacket(data);
      })
})
}

function textBoxEnter(){
        if (usernametextbox.stage==1){
            usernametextbox.stage=2
            username=usernametextbox.value()
            usernametextbox.value("")
            background(100)
            text("Enter Connect code:",140,180)
            text("your code:"+connectcode,0,10)
            redraw()
        }
        else if (usernametextbox.stage==2){
            print("logng")
            usernametextbox.remove()
            usernamebutton.remove()
            background(100)
            textAlign(CENTER)
            text("loading...",200,200)
           connout=peer.connect("bad-productions-uuid-domain-app-01-"+usernametextbox.value());
           connout.on('open',function(){
            if (connout.open){
            print("sent connect request")
            connout.send("userid "+username)
            connout.send("conn "+connectcode)
        }
        })
        }
}
function dbprint(login){
    if (debugMode){
        print(login)
    }
}
function draw() {
    if (connected){
    dbprint("refresh");
    background(100);

    textAlign(LEFT);
    pingaverage.push(ping)
    if (pingaverage.length>30){
        pingaverage=pingaverage.splice(1,1);
    }
    text("uuid:"+connectcode,0,10)

  if (pingaverage.length>0){  text("ping:"+ping,100,10)}
    else {
         text("ping:"+"disconnected",100,10)
    }
    ellipse(200,200,10)
    textAlign(CENTER);
    text(username,200,200-10); 
    
    ellipse(p2x-p1x+200,p2y-p1y+200,10)
    textAlign(CENTER);
    text(username2,p2x-p1x+200,p2y-p1y-10+200);
    if (keyIsDown(83)){
        p1y+=1
    }
    if (keyIsDown(87)){
        p1y-=1
    }
    if (keyIsDown(65)){
        p1x-=1
    }
    if (keyIsDown(68)){
        p1x+=1
    }
    }
    if (second()>lastsecpacket+4){
        print("timeout")
        clear()
        background(100)
        textAlign(CENTER)
        textSize(30)
        text("CONNECTION TIMEOUT",200,150)
        textSize(20)
        text("refresh page to reconnect",200,200)
        connected=false
    }
}





function sendpacket(x,y){
    dbprint("sending packet:"+"pos "+x+" "+y)
    if (connout.open){
    connout.send("pos "+x+" "+y);pingpoint=floor(millis())}
    else {
        dbprint("send failed")
    }
}
function proccespacket(packetdata){
    lastsecpacket=second()
    dpac=packetdata.split(" ");
    if (dpac[0]=="userid"){
        username2=dpac[1];
    }
    if (dpac[0]=="ok"){
        dbprint("ok:"+dpac[1])
    }
    if (dpac[0]=="pos"){
        dbprint("got packet")
        ping=floor(millis())-pingpoint
        p2x=parseFloat(dpac[1]);
        p2y=parseFloat(dpac[2]);
        sendpacket(p1x,p1y);
    }
    if (dpac[0]=="conecho"){
        connected=true;
        print("connected")
        sendpacket(p1x,p1y);
    }
    if (dpac[0]=="conn"){
        connout=peer.connect("bad-productions-uuid-domain-app-01-"+dpac[1]);
        connout.on('open',function(){
            if (connout.open){
            dbprint("echoing uid")
            connout.send("userid "+username)
            connout.send("conecho")
        }
        })
    }
}
function keyPressed(){
    if (key=="c"){

        connout=peer.connect("bad-productions-uuid-domain-app-01-"+prompt("enter connection id"));
        connout.on('open',function(){
            if (connout.open){
            dbprint("sent connect request")
            connout.send("userid "+username)
            connout.send("conn "+connectcode)
        }
        })
        print("gif")

    }
    print(key)
    if (key=="Enter"){
        textBoxEnter()
    }
}
