import React from 'react';
 
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var listItem={
        "petit bois":{"name":"petit bois","type":"combustible","value":3,"poids":2,"label":"heat"},
        "buche":{"name":"buche","type":"combustible","value":7,"poids":4,"label":"heat"},
        "journaux":{"name":"journaux","type":"combustible","value":1,"poids":1,"label":"heat"},

        "viande congelé":{"name":"viande congelé","type":"nourriture","value":10,"poids":2,"label":"food","cuisinable":1},
        "boite de conserve":{"name":"viande congelé","type":"nourriture","value":6,"poids":1,"label":"food","cuisinable":1},

        "boisson gazeuse":{"name":"boisson gazeuse","type":"boisson","value":[3,2],"poids":1,"label":"thirst"},

        "paracétamole":{"name":"paracétamole","type":"antibiotique","value":4,"poids":1,"soigne":["infection"],"label":"heal"},
        "médicament à base de plantes":{"name":"médicament à base de plantes","type":"antibiotique","value":3,"poids":1,"soigne":["fièvre"],"label":"heal"},

        "boite a tisser":{"name":"boite a tisser","type":"métier","poids":1},
        "peau":{"name":"peau","type":"métier","poids":1},
        "tissu":{"name":"tissu","type":"métier","poids":1},

        "bonnet":{"name":"bonnet","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,2),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},
        "pull":{"name":"pull","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,5),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},
        "manteau":{"name":"manteau","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(2,8),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},
        "gant":{"name":"gant","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,2),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},
        "pantalon":{"name":"pantalon","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(2,7),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},
        "chaussure":{"name":"chaussure","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,5),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},

        "pistolet":{"name":"pistolet","type":"arme","value":getRandomInt(1,100),"poids":getRandomInt(1,3),"equiped":0,"label":"damage","repair":["engrenage"],"need":"9 mm"},

        "9 mm":{"name":"9 mm","type":"munition","poids":1},
    }

    function chooseItem(){
        for (item in listItem) {
            if(getRandomInt(1,10) == 5){
                return listItem[item];
                break;
            }
            
        }
    }

function App() {
  return chooseItem();
}
 
export default App;

