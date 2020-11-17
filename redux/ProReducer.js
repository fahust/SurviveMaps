import { combineReducers } from 'redux';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const INITIAL_STATE = {
  stats:{
    "vie":45,
    "faim":22,//33,
    "soif":72,
    "energie":44,//
    "poids":12,
    "poids max":100,
    "température":77,
    "vent":10,
    "objet trouvé":24,
  },
  job:{
    "weaver":1,
    "cooking":1,
    "enginer":1,
    "shooter":1,
    "brawler":10,
    "infiltration":1,
  },
  body:{
    "chest":0,
    "obliques":1,
    "abs":0,
    "biceps":0,
    "triceps":0,
    "neck":1,
    "front-deltoids":0,
    "head":0,
    "abductors":1,
    "quadriceps":1,
    "knees":0,
    "calves":0,
    "forearm":0,
  },
  items:{
    1:{"name":"petit bois","type":"combustible","value":3,"poids":2,"label":"heat"},
    2:{"name":"buche","type":"combustible","value":7,"poids":4,"label":"heat"},
    3:{"name":"journaux","type":"combustible","value":1,"poids":1,"label":"heat"},

    4:{"name":"viande congelé","type":"nourriture","value":10,"poids":2,"label":"food","cuisinable":1},
    5:{"name":"viande congelé","type":"nourriture","value":6,"poids":1,"label":"food","cuisinable":1},

    6:{"name":"boisson gazeuse","type":"boisson","value":[3,2],"poids":1,"label":"thirst"},

    7:{"name":"paracétamole","type":"antibiotique","value":4,"poids":1,"soigne":["infection"],"label":"heal"},
    8:{"name":"médicament à base de plantes","type":"antibiotique","value":3,"poids":1,"soigne":["fièvre"],"label":"heal"},

    9:{"name":"boite a tisser","type":"métier","poids":1},
    10:{"name":"peau","type":"métier","poids":1},
    11:{"name":"tissu","type":"métier","poids":1},

    12:{"name":"bonnet","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,2),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},
    13:{"name":"pull","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,5),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},
    14:{"name":"manteau","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(2,8),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},
    15:{"name":"gant","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,2),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},
    16:{"name":"pantalon","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(2,7),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},
    17:{"name":"chaussure","type":"vêtements","value":getRandomInt(1,100),"poids":getRandomInt(1,5),"equiped":0,"label":"protection","repair":["tissu","boite a tisser"]},

    18:{"name":"pistolet","type":"arme","value":getRandomInt(1,100),"poids":getRandomInt(1,3),"equiped":1,"label":"damage","repair":["engrenage",],"need":"9 mm"},

    19:{"name":"9 mm","type":"munition","poids":1},
    20:{"name":"9 mm","type":"munition","poids":1},
    21:{"name":"9 mm","type":"munition","poids":1},
    22:{"name":"9 mm","type":"munition","poids":1},
    23:{"name":"9 mm","type":"munition","poids":1},
  },
  distance:1,
  latitude:37.78248860156281,
  longitude:-122.42418073117754,
  nearFire:undefined,
  exploreEvent:[],
  rest:0,
};

//Need object assign for re-render component
const proReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      state.items[state.stats["objet trouvé"]+1] = action.payload;
      state.stats["objet trouvé"] = state.stats["objet trouvé"]+1;
      return Object.assign({}, state, {
      })

    case 'SET_USER':
      return Object.assign({}, state, {
        stats : action.payload,
        distance : 1,
      })

    case 'ADD_DISTANCE':
      return Object.assign({}, state, {
      distance : state.distance+action.payload.distance,
      latitude : action.payload.latitude,
      longitude : action.payload.longitude,
      nearFire : action.payload.nearFire,
      rest : 0,
      })

    case 'TAKE_A_REST':
      return Object.assign({}, state, {
      rest : 1,
      })

    case 'USE_ITEM':
      delete state.items[action.payload]
      return Object.assign({}, state, {
        items : state.items,
      })
    case 'DELETE_ITEM':
      delete state.items[action.payload]
      return Object.assign({}, state, {
        items : state.items,
      })

    case 'EQUIP_CLOTHES':
      if(state.items[action.payload].equiped == 0){
        for (item in state.items) {
          if(state.items[item].name == state.items[action.payload].name){
            state.items[item].equiped = 0;
          }
        }
        state.items[action.payload].equiped=1;
      }else{
        state.items[action.payload].equiped = 0;
      }
      return Object.assign({}, state, {})

    case 'LOAD_USER':
      state = action.payload;
      return Object.assign({}, state, {})

    case 'UPGRADE_JOB':
      if(state.job[action.payload] < 100)
        state.job[action.payload]++
      return Object.assign({}, state, {})

    case 'REPAIR_ITEM':
      var job;
      if(action.payload.type == "arme") job = "enginer";
      if(action.payload.type == "vêtements") job = "weaver";
      if(state.job[job] < 100)
        state.job[job]++
      state.items[action.payload.item].durability += state.job[job];
      if(state.items[action.payload.item].durability > 100)
        state.items[action.payload.item].durability = 100;
      return Object.assign({}, state, {})

    case 'END_EVENT':
      action.payload.items.forEach(item => {
        state.items[state.stats["objet trouvé"]+1] = item;
        state.stats["objet trouvé"] = state.stats["objet trouvé"]+1;
      });
      return Object.assign({}, state, {
        stats : action.payload.stats,
        exploreEvent : [...state.exploreEvent,action.payload.exploreEvent],
      })

    default:
      return state
  }
  /*switch (action.type) {
    case 'ADD_FRIEND':
      // Pulls current and possible out of previous state
      // We do not want to alter state directly in case
      // another action is altering it at the same time
      const {
        current,
        possible,
      } = state;

      // Pull friend out of friends.possible
      // Note that action.payload === friendIndex
      const addedFriend = possible.splice(action.payload, 1);

      // And put friend in friends.current
      current.push(addedFriend);

      // Finally, update the redux state
      const newState = { current, possible };

      return newState;

    default:
      return state
  }*/
};

export default combineReducers({
  user: proReducer
});

