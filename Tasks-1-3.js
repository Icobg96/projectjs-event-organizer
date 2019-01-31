var client = {
    name : "",
    lastName : "",
    gendar : "",
    age : -1,
    amountMony : 0,
    vipPoints : 0
}
var systemIsClose=false;
var clients=[];
var events=[];
function closeOrOpenSystem(){

    systemIsClose=(!systemIsClose);

}
function getEventById(eventId){
    for (let index = 0; index < events.length; index++) {
        if(events[index].id===eventId){
            return {event : events[index],
                    index : index
            };
        }
        
     }
}
function addEvent(name,access,date,price){
    if (systemIsClose && typeof name !== 'string'){
        return;
    }
    let eventId;
    if(events.length===0){
        eventId=0;
    }else{
        eventId=events[events.length-1].id+1;
    }
    if(!(date instanceof Date)){
        date=new Date();
        console.log("you didn't enter date or date is not valid. We are enter date now");
    }
    if (typeof price ==='undefined'){
        price=0.00;
    }
    if(typeof access!='boolean'){
        access=true;
    }
    
    let event = {
         id : eventId,
         name : name,
         access : access,
         clients : [],
         date : date,
         price : price,
         income : 0,
         isArchived : false,
         rating : 0,
         votedClients : [] 
         
     }
    events.push(event);
 }
 function editEvent(eventId,newName,NewAccess,date,price){
    let event = getEventById(eventId);
    if(event.isArchived){
        console.log('Event is archived your are not allowed to edit');
        return;
    }
    if(typeof event ==='undefined'){
        console.log('This eventis not exist');
        return;
    }
      event=event.event
    if(typeof newName!=='string'){
        console.log('Wrong name')
        return;
    }
    event.name=newName;
    if(typeof NewAccess!=='boolean'){
        console.log('access is not changed')
        return;
    }
    event.access=NewAccess;
    if (date instanceof Date){
        event.date=date;
    }
    if(typeof price ==='number'){
        event.price=price;
    }
 }
 
 function removeEventById(eventId){
    let index=getEventById(eventId).index;    
    events.splice(index,1);
    alert("Event remove sucssesful")
       
 }
 function removeClientFromEvent(event,client){
     if(event.isArchived){
         console.log('Event is archived your are not allowed to edit');
         return;
     }
   let index = event.clients.indexOf(client);
   event.clients.splice(index,1);
 }
 function addClientToEvent(event,client){
    if(event.isArchived){
        console.log('Event is archived your are not allowed to edit');
        return;
    }
     let checkForVipOrPey=function(){
        if (client.vipPoints===5){
            client.vipPoints=0;
        }else{
            client.amountMony-=event.price;
            client.vipPoints++;
            event.income+=event.price;
        }
     }
     if(typeof event !=='object'){
        console.log('Input event is not event');
        return;
    }
     if(typeof client !=='object'){
         console.log('input client is not client');
         return;
     }
     if(client.amountMony < event.price){
        console.log("Тhis client does not have enough money");
        return;
     }
     if(!event.access){
        if(client.age>=18){

            checkForVipOrPey();
            event.clients.push(client);

        }else{
            console.log("This client does not meet age restrictions")
        }
     }else{
        checkForVipOrPey();
        event.clients.push(client);
     }
 }
 function getEventWithMostClient(){
     let clientCount = events.map(e => {
             return {
                 client : e.clients.length,
                 index : events.indexOf(e)
                }});
     function compare(a,b) {
         if (a.client > b.client)
             return -1;
         if (a.client < b.client)
             return 1;
         return 0;
         }
     clientCount.sort(compare);
     
     for (let index = 1; index < clientCount.length; index++) {
        if(clientCount[index].client!==clientCount[0].client){
            clientCount=clientCount.slice(0,index);
            break;
        }
     }
    
     if(clientCount.length!==events.length){
         for (let index = 0; index < clientCount.length; index++) {
            dataVisualization(events[clientCount[index].index]);    
         }
         return;
     }
     console.log('all events have equal clients');
 }
 function vote(client,event,rate){
     if(!event.isArchived){
         console.log("you can't rate for this event becouse it is not archived");
         return;
     }
     if(rate<1||rate>10){
         console.log('rating must be between 1-10');
         return;
     }
     for (let index = 0; index < event.votedClients.length; index++) {
          if(event.votedClients[index]===client){
              console.log('you already vote');
              return;
          }
          let currentRate=(rate*3)/5;
          event.votedClients.push(client);
          if(event.rating===0){
            event.rating=currentRate;
            return;
          }
          event.rating=(event.rating+currentRate)/2;
      }

 }
 function listingClientsFromEvent(event){
     let clients=event.clients;
     for (let index = 0; index < clients.length; index++) {
     
        console.log('First name : '+clients[index].name + ' | last Name : '+clients[index].lastName,+' | gender :'+clients[index].gendar+
                     ' | age : '+clients[index].age+' | amount mony : '+clients[index].amountMony+' | vip points : '+clients[index].vipPoints);
        console.log('---------------------------------------------------------------------------------------------');             
         
     }
 }
 function dataVisualization(event){

    let name = event.name;
    let access = event.access;
    let date = event.date;
    let price = event.price;
    let rating = event.rating > 0 ? event.rating : 'an update is expected';
    name = access ? ('# ' + name) : ('* ' + name);
    name = (price > 0) ? ('$ ' + name) : ('! ' + name);
    name = event.isArchived ? ('~ ' + name) : name;
    console.log('name : ' + name + ' | access : ' + access + ' | date : ' + date + ' | price : ' +
                price + ' | rating : ' + rating);
                console.log('---------------------------------------------------------------------------------------------');             

 }
 function eventListing(firstFilterFunction,firstFilterParam,secondFilterFunction,secondFilterParam){
     let firstFilterResult;
     let secondFilterResult;
     for (let index = 0; index < events.length; index++) {
         
        firstFilterResult = (typeof firstFilterFunction === 'function') ? firstFilterFunction(events[index],firstFilterParam) : true;
        secondFilterResult = (typeof secondFilterFunction === 'function') ? secondFilterFunction(events[index],secondFilterParam) : true;
            if(firstFilterResult&&secondFilterResult){
                dataVisualization(events[index]);
            }
         
        }    
    }
var filter={
      ByIndex : function(event,index){
                 if(events.indexOf(event)===index){
                       return true;
                    }
                 return false;
                },
      byName : function (event,name){
                 if(event.name===name){
                     return true;
                    }
                 return false;
                },
      byAccess : function (event,access){
                    if(event.access===access){
                         return true;
                        }
                    return false;
                },
     byArchived: function(event,isArchived){
                     if(event.isArchived===isArchived){
                        return true;
                    }            
                    return false;
     }          

}
function getAllEventsWithFreeAccess(){
    eventListing(filter.byAccess,true);
}
function arhivateEvent(event){
    event.isArchived=true;
}
 
function getEventIncome(archivedEvent){
    if(!archivedEvent.isArchived){
        console.log('event is not archived');
        return;
    }
    console.log('name : ' + archivedEvent.name + ' | income : ' + archivedEvent.income);
}
 addEvent('fsfs',true);
 addEvent('fsfgdss',false);
 addEvent('fsfs11212',true);
 addClientToEvent(events[1],{   
     name:"ico",
     lastName:"asds",
     gendar:"m",
     age:22});
     addClientToEvent(events[0],{   
        name:"ico",
        lastName:"asds",
        gendar:"m",
        age:22});
        addClientToEvent(events[0],{   
            name:"ico",
            lastName:"asds",
            gendar:"m",
            age:22});
arhivateEvent(events[0]);
//closeOrOpenSystem();
//console.log(systemIsClose);

//console.log(names);
//names.splice(1,1);
//console.log(names.splice(1,1));
eventListing(filter.byArchived,false,filter.byAccess,false);
//listingClientsFromEvent(events[0]);




 //date.setFullYear(1997);
 //date.setMonth(9);
 //date.setDate(23);




 /*function addButton(){
    let eventName = document.getElementById("eventName").value;
    let eventAccess=document.getElementById("access").checked;
    let eventId;
    if(events.length===0){
        eventId=0;
    }else{
        eventId=events[events.length-1].id+1;
    }
    addEvent(eventId,eventName,eventAccess);
    console.clear();
      for(let i=0;i<events.length;i++){
        console.log(events[i].id);
        console.log(events[i].name);
        console.log(events[i].access);
        }

 }
 function showAllEvents(){
     var table=document.getElementById("myTable");
     if(table!=null){
         document.body.removeChild(table);
     }
     
     var x = document.createElement("TABLE");
     x.setAttribute("id", "myTable");
     document.body.appendChild(x);
     for (let index = 0; index < events.length; index++) {

          var y = document.createElement("TR");
          y.setAttribute("id", "myTr"+index);
          document.getElementById("myTable").appendChild(y);

          var z = document.createElement("TD");
          var z1 = document.createElement("TD");
          var z2 = document.createElement("TD");
          var t = document.createTextNode(events[index].id);
          var td = document.createTextNode(events[index].name);
          var td1 = document.createTextNode(events[index].access);
          z.appendChild(t);
          z1.appendChild(td);
          z2.appendChild(td1);
          
          document.getElementById("myTr"+index).appendChild(z);
          document.getElementById("myTr"+index).appendChild(z1);
          document.getElementById("myTr"+index).appendChild(z2);
         
     }
 }*/
 //addEvent(1,"asd",true);
 //addEvent(2,"dsa",false);
 //addEvent(3,"fds",true);
 //for(let i=0;i<events.length;i++){
 //console.log(events[i].id);
 //}
 //removeEventById(2);
 //for(let i=0;i<events.length;i++){
  //  console.log(events[i].id);
  //  }
  