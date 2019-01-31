var systemIsClose=false;
var clients=[];
var events=[];
function closeOrOpenSystem(){

    systemIsClose=(!systemIsClose);

}
function addClient(firstName,lastName,gender,age,amountMony){
    if(systemIsClose){
        console.log('system is closed');
        return;
    }
     if(typeof amountMony !== 'number'||amountMony<0){
         amountMony=0;
     }

    clients.push({firstName,lastName,gender,age,amountMony,vipPoints : 0});
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
    if (systemIsClose || typeof name !== 'string'|| name.length===0){

        return;
    }
    let eventId;
    if(events.length===0){
        eventId=1;
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
    event=event.event;
    if(typeof newName==='string' && newName.length>0){  
        event.name=newName;
    }
    if(typeof NewAccess==='boolean'){
        event.access=NewAccess;
    }
    if (date instanceof Date){
        event.date=date;
    }
    if(typeof price ==='number'){
        event.price=price;
    }
 }
 
 function removeEventById(eventId){
    let event=getEventById(eventId);    
    if(event){
        events.splice(event.index,1);
        console.log("Event remove sucssesful");
    }
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
            console.log('successfully insert Client');
        }else{
            client.amountMony-=event.price;
            client.vipPoints++;
            event.income+=event.price;
            console.log('successfully insert Client');
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
        if(client.age >= 18){

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
 function listingClientsFromEvent(event,filterFunction,filterParam){
     let clients=event.clients;
     let filterResult;
     for (let index = 0; index < clients.length; index++) {

        filterResult = (typeof filterFunction === 'function') ? filterFunction(clients[index],filterParam) : true;

        if(filterResult){
                console.log('First name : '+clients[index].firstName + ' | last Name : '+clients[index].lastName+' | gender : '+clients[index].gender+
                            ' | age : '+clients[index].age+' | amount mony : '+clients[index].amountMony+' | vip points : '+clients[index].vipPoints);
                console.log('---------------------------------------------------------------------------------------------');             
        }
     }
 }
 function dataVisualization(event){

    let name = event.name;
    let access = event.access ? 'underaged access' : '18+';
    let date = event.date;
    let price = event.price;
    let rating = event.rating > 0 ? event.rating : 'an update is expected';
    name = event.access  ? ('# ' + name) : ('* ' + name);
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
     byArchived : function(event,isArchived){
                     if(event.isArchived===isArchived){
                        return true;
                    }            
                    return false;
     },
     byGender : function(client,gender){
                    if(client.gender.toLocaleLowerCase()===gender.toLocaleLowerCase()){
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
//here adding events
addEvent('birthday',true,new Date('12/02/2019'),20);// index 0
addEvent('Rock fest',false,new Date('09/03/2019'),10);// index 1
addEvent('Plovdiv european capital of culture',true,new Date('15/01/2019'));// index 2
addEvent('beer fest',false,new Date('20/02/2019'),15);// index 3
addEvent('retro pop-folk party secrets',false,new Date('04/02/2019'),5);// index 4
addEvent('circus2',false,new Date('05/05/2019'),3.5);// index 5
addEvent('circus',true,new Date('08/05/2019'),35);// index 6

//here adding clients
addClient('Ivan','Petov','male',18,60.00);// index 0
addClient('Nina','Stoqnoa','fmale',15,40);// index 1
addClient('Genadi','Dimitrov','male',22,100.00);// index 2
addClient('Victoriya','Ivanova','fmale',40,200.00);// index 3
addClient('Petar','Katsarov','male',17,70.00);// index 4
addClient('Preslav','Milev','male',24,80.00);// index 5
addClient('Ivelina','Kirova','fmale',16,66.00);// index 6

//here adding clients to events
addClientToEvent(events[0],clients[0]); //successfully insert Client
addClientToEvent(events[1],clients[0]); //successfully insert Client
addClientToEvent(events[1],clients[1]); //This client does not meet age restrictions
addClientToEvent(events[1],clients[2]); //successfully insert Client
addClientToEvent(events[1],clients[6]); //This client does not meet age restrictions
for(let i=0; i < 7; i++){
    addClientToEvent(events[2],clients[i]); //successfully insert all Clients in this event
}
addClientToEvent(events[3],clients[0]); //successfully insert Client
addClientToEvent(events[3],clients[2]); //successfully insert Client 
addClientToEvent(events[3],clients[3]); //successfully insert Client
addClientToEvent(events[3],clients[6]); //This client does not meet age restrictions
addClientToEvent(events[6],clients[0]); //Тhis client does not have enough money
addClientToEvent(events[6],clients[1]); //successfully insert Client
addClientToEvent(events[6],clients[3]); //successfully insert Client

console.log('===========================================================================================================');
console.log('Listing all eventss');
console.log('===========================================================================================================');

eventListing();

console.log('===========================================================================================================');
console.log('Listing after changed');
console.log('===========================================================================================================');
editEvent(1,'birthday 18+');
editEvent(1,null,false);
eventListing();
console.log('===========================================================================================================');
console.log('Listing after remove');
console.log('===========================================================================================================');
//here delete event
removeEventById(6); //delete event with id : 6 "circus2"
eventListing();

//here remove client from event
removeClientFromEvent(events[2],clients[0]); //remove "ivan petrov" from "Plovdiv european capital of culture"
console.log('===========================================================================================================');
console.log('Listing clients from "Plovdiv european capital of culture"');
console.log('===========================================================================================================');
listingClientsFromEvent(events[2]);
console.log('===========================================================================================================');
console.log('Listing clients from "Plovdiv european capital of culture" filter by gender');
console.log('===========================================================================================================');
listingClientsFromEvent(events[2],filter.byGender,'fmale');


