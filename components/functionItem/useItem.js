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

        "bonnet":{"name":"bonnet","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,2),"equiped":0,"label":"protection"},
        "pull":{"name":"pull","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,5),"equiped":0,"label":"protection"},
        "manteau":{"name":"manteau","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(2,8),"equiped":0,"label":"protection"},
        "gant":{"name":"gant","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,2),"equiped":0,"label":"protection"},
        "pantalon":{"name":"pantalon","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(2,7),"equiped":0,"label":"protection"},
        "chaussure":{"name":"chaussure","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,5),"equiped":0,"label":"protection"},


        "boite a tisser":{"name":"boite a tisser","type":"métier","poids":1},
        "peau":{"name":"peau","type":"métier","poids":1},
        "tissu":{"name":"tissu","type":"métier","poids":1},

        "viande congelé":{"name":"viande congelé","type":"nourriture","value":10,"poids":2,"label":"food"},

        "boisson gazeuse":{"name":"boisson gazeuse","type":"boisson","value":[2,3],"poids":1,"label":"food"},

        "paracétamole":{"name":"paracétamole","type":"antibiotique","value":4,"poids":1,"soigne":["infection"]},
        "médicament à base de plantes":{"name":"médicament à base de plantes","type":"antibiotique","value":3,"poids":1,"soigne":["fièvre"]},
    }

    function heal(item,stats){
        /*if(item.soigne){
            stats.maladies.forEach(maladie => {
                if(item.soigne.includes(maladie))
                    maladie.
            });
        }*/
        stats.vie += item.value;
        if(stats.vie >= 100)
            stats.vie = 100;
        return stats;
    }
    function eat(value,stats){
        stats.faim += value;
        if(stats.faim >= 100)
            stats.faim = 100;
        return stats;
    }
    function drink(value,stats){
        stats.soif += value;
        if(stats.soif >= 100)
            stats.soif = 100;
        return stats;
    }

    function useItem(stats,item){
        if(item.type == "antibiotique"){
            stats = heal(item,stats);
            return stats;
        }
        if(item.type == "nourriture"){
            stats = eat(item.value,stats);
            return stats;
        }
        if(item.type == "boisson"){
            stats = drink(item.value[0],stats);
            stats = eat(item.value[1],stats);
            return stats;
        }
    }

function App(stats,item) {
  return useItem(stats,item);
}
 
export default App;

