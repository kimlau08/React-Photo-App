import React, { Component, useState } from 'react';
import './App.css';
import WineForm from './components/WineForm';
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";

import ImageDB from './components/ImageDB';

/****************************************************************/

const wineData =  [
  {
    "id": 4477,
    "name": "CHATEAU DE SAINT COSME",
    "year": 2009,
    "grapes": "Grenache / Syrah",
    "country": "France",
    "region": "Southern Rhone",
    "description": "The aromas of fruit and spice give one a hint of the light drinkability of this lovely wine, which makes an excellent complement to fish dishes.",
    "picture": "http://s3-us-west-2.amazonaws.com/sandboxapi/saint_cosme.jpg",
    "price": 13,
    "instance_id": "e02526",
    "created_at": "2020-04-08T19:19:51.433Z",
    "updated_at": "2020-04-08T19:19:51.433Z"
  },
  {
    "id": 4478,
    "name": "LAN RIOJA CRIANZA",
    "year": 2006,
    "grapes": "Tempranillo",
    "country": "Spain",
    "region": "Rioja",
    "description": "A resurgence of interest in boutique vineyards has opened the door for this excellent foray into the dessert wine market. Light and bouncy, with a hint of black truffle, this wine will not fail to tickle the taste buds.",
    "picture": "http://s3-us-west-2.amazonaws.com/sandboxapi/lan_rioja.jpg",
    "price": 21,
    "instance_id": "e02526",
    "created_at": "2020-04-08T19:19:51.461Z",
    "updated_at": "2020-04-08T19:19:51.461Z"
  },
  {
    "id": 4479,
    "name": "MARGERUM SYBARITE",
    "year": 2010,
    "grapes": "Sauvignon Blanc",
    "country": "USA",
    "region": "California",
    "description": "The cache of a fine Cabernet in ones wine cellar can now be replaced with a childishly playful wine bubbling over with tempting tastes of black cherry and licorice. This is a taste sure to transport you back in time.",
    "picture": "http://s3-us-west-2.amazonaws.com/sandboxapi/margerum.jpg",
    "price": 25,
    "instance_id": "e02526",
    "created_at": "2020-04-08T19:19:51.482Z",
    "updated_at": "2020-04-08T19:19:51.482Z"
  },
  {
    "id": 4480,
    "name": "OWEN ROE \"EX UMBRIS\"",
    "year": 2009,
    "grapes": "Syrah",
    "country": "USA",
    "region": "Washington",
    "description": "A one-two punch of black pepper and jalapeno will send your senses reeling, as the orange essence snaps you back to reality. Dont miss this award-winning taste sensation.",
    "picture": "http://s3-us-west-2.amazonaws.com/sandboxapi/ex_umbris.jpg",
    "price": 15,
    "instance_id": "e02526",
    "created_at": "2020-04-08T19:19:51.501Z",
    "updated_at": "2020-04-08T19:19:51.501Z"
  },
  {
    "id": 4481,
    "name": "REX HILL",
    "year": 2009,
    "grapes": "Pinot Noir",
    "country": "USA",
    "region": "Oregon",
    "description": "One cannot doubt that this will be the wine served at the Hollywood award shows, because it has undeniable star power. Be the first to catch the debut that everyone will be talking about tomorrow.",
    "picture": "http://s3-us-west-2.amazonaws.com/sandboxapi/rex_hill.jpg",
    "price": 32,
    "instance_id": "e02526",
    "created_at": "2020-04-08T19:19:51.521Z",
    "updated_at": "2020-04-08T19:19:51.521Z"
  },
  {
    "id": 4482,
    "name": "VITICCIO CLASSICO RISERVA",
    "year": 2007,
    "grapes": "Sangiovese Merlot",
    "country": "Italy",
    "region": "Tuscany",
    "description": "Though soft and rounded in texture, the body of this wine is full and rich and oh-so-appealing. This delivery is even more impressive when one takes note of the tender tannins that leave the taste buds wholly satisfied.",
    "picture": "http://s3-us-west-2.amazonaws.com/sandboxapi/viticcio.jpg",
    "price": 45,
    "instance_id": "e02526",
    "created_at": "2020-04-08T19:19:51.540Z",
    "updated_at": "2020-04-08T19:19:51.540Z"
  },
  {
    "id": 4483,
    "name": "CHATEAU LE DOYENNE",
    "year": 2005,
    "grapes": "Merlot",
    "country": "France",
    "region": "Bordeaux",
    "description": "Though dense and chewy, this wine does not overpower with its finely balanced depth and structure. It is a truly luxurious experience for the senses.",
    "picture": "http://s3-us-west-2.amazonaws.com/sandboxapi/le_doyenne.jpg",
    "price": 12,
    "instance_id": "e02526",
    "created_at": "2020-04-08T19:19:51.556Z",
    "updated_at": "2020-04-08T19:19:51.556Z"
  },
  {
    "id": 4484,
    "name": "DOMAINE DU BOUSCAT",
    "year": 2009,
    "grapes": "Merlot",
    "country": "France",
    "region": "Bordeaux",
    "description": "The light golden color of this wine belies the bright flavor it holds. A true summer wine, it begs for a picnic lunch in a sun-soaked vineyard.",
    "picture": "http://s3-us-west-2.amazonaws.com/sandboxapi/bouscat.jpg",
    "price": 34,
    "instance_id": "e02526",
    "created_at": "2020-04-08T19:19:51.571Z",
    "updated_at": "2020-04-08T19:19:51.571Z"
  },
  {
    "id": 5191,
    "name": "123",
    "year": 2009,
    "grapes": "Merlot",
    "country": "France",
    "region": "Bordeaux",
    "description": "The light golden color of this wine belies the bright flavor it holds. A true summer wine, it begs for a picnic lunch in a sun-soaked vineyard.",
    "picture": "http://s3-us-west-2.amazonaws.com/sandboxapi/bouscat.jpg",
    "price": 34,
    "instance_id": "e02526",
    "created_at": "2020-04-12T22:59:52.511Z",
    "updated_at": "2020-04-12T22:59:52.511Z"
  }
];
/****************************************************************/

/****************************************************************/
const photoData=  [
  {
    "id": 1000,
    "imageIdx": 0,
    "likes": 100,
    "dislikes": 10,
    "owner": "user1",
    "commentIdx": [ 4000, 4001, 4002, 4003 ]
  },
  {
    "id": 1001,
    "imageIdx": 1,
    "likes": 101,
    "dislikes": 11,
    "owner": "user1",
    "comments": [ 4004, 4005, 4006, 4007 ]
  },
  {
    "id": 1002,
    "imageIdx": 2,
    "likes": 102,
    "dislikes": 12,
    "owner": "user1",
    "comments": [ 4008, 4009, 4010, 4011]
  },
  {
    "id": 1003,
    "imageIdx": 3,
    "likes": 103,
    "dislikes": 13,
    "owner": "user1",
    "comments": [ 4012 ]
  },
  {
    "id": 1004,
    "imageIdx": 4,
    "likes": 104,
    "dislikes": 14,
    "owner": "user1",
    "comments": [ 4013 ]
  },
  {
    "id": 2000,
    "imageIdx": 9,
    "likes": 109,
    "dislikes": 19,
    "owner": "user2",
    "comments": [ 4014 ]
  },
  {
    "id": 2001,
    "imageIdx": 10,
    "likes": 110,
    "dislikes": 20,
    "owner": "user2",
    "comments": [ 4015 ]
  },
  {
    "id": 2002,
    "imageIdx": 11,
    "likes": 111,
    "dislikes": 21,
    "owner": "user2",
    "comments": [ 4016 ]
  },
  {
    "id": 2003,
    "imageIdx": 12,
    "likes": 112,
    "dislikes": 22,
    "owner": "user2",
    "comments": [ 4017 ]
  },
  {
    "id": 2004,
    "imageIdx": 13,
    "likes": 113,
    "dislikes": 23,
    "owner": "user2",
    "comments": [ 4018 ]
  }
];
/****************************************************************/

const userData=[
    {
      "id": 3000,
      "userId": "user1",
      "password": "user1",
      "name":  "user1",
      "favImg": [2000, 2001, 2002]
    },
    {
      "id": 3001,
      "userId": "user2",
      "password": "user2",
      "name":  "user2",
      "favImg": [1000, 1001, 1002]
    }
  ]

/****************************************************************/

const commentData=[
    {
      "id": 4000,
      "comment": "Easter!",
      "source": "user1"
    },
    {
      "id": 4001,
      "comment":  "Eggs!",
      "source": "user1"
    },
    {
      "id": 4002,
      "comment":  "Ah!",
      "source": "user2"
    },
    {
      "id": 4003,
      "comment":  "Candies",
      "source": "user2"
    },
    {
      "id": 4004,
      "comment": "Easter Again!", 
      "source": "user1"
    },
    {
      "id": 4005,
      "comment":  "More Eggs!",
      "source": "user1"
    },
    {
      "id": 4006,
      "comment":  "Awe!",
      "source": "user2"
    },
    {
      "id": 4007,
      "comment":  "More!",
      "source": "user2"
    },
    {
      "id": 4008,
      "comment":  "More!",
      "source": "user2"
    },
    {
      "id": 4009,
      "comment": "Easter Easter!",
      "source": "user1"
    },
    {
      "id": 4010,
      "comment":   "More More!",
      "source": "user1"
    },
    {
      "id": 4011,
      "comment":   "Awe!",
      "source": "user2"
    },
    {
      "id": 4012,
      "comment":   "Eggnog!",
      "source": "user2"
    },
    {
      "id": 4013,
      "comment":   "Eggs Eggs!",
      "source": "user1"
    },
    {
      "id": 4014,
      "comment":   "Egg mountains",
      "source": "user1"
    },
    {
      "id": 4015,
      "comment":   "Legs!",
      "source": "user2"
    },
    {
      "id": 4016,
      "comment":  "Sun",
      "source": "user2"
    },
    {
      "id": 4017,
      "comment":  "Owl",
      "source": "user1"
    },
    {
      "id": 4018,
      "comment":  "Cute",
      "source": "user1"
    },
// {
//   "id": 4019,
//   "comment":  "Cute",
//   "source": "user2"
// },
// {
//   "id": 4020,
//   "comment": "Cowboy",
//   "source": "user2"
// }

  ];

/****************************************************************/




export default class App extends Component {
  constructor(props) {
    super(props);

    this.state={
      response: wineData,   //user database
      wineNames: [],
      wineImagePaths: [],
      wineStrings: [],

      images: ImageDB,
      photos: photoData,
      users: userData,
      comments: commentData 

    }

    this.getWineAPI=this.getWineAPI.bind(this);
    this.loadWineInfo=this.loadWineInfo.bind(this);
    this.displayWineImgAndInfo=this.displayWineImgAndInfo.bind(this);
    this.addNewWineData=this.addNewWineData.bind(this);
    this.deleteWineData=this.deleteWineData.bind(this)

    //Initialized database
    this.getWineAPI();
  }
  
// componentDidMount() {
//   this.getWineAPI();
// }

  loadWineInfo() {    //called from the constructor => instead of this.setState, use this.state= { ..... }
    let wineNameList=[];
    let wineImagePathList=[];
    let wineStrArray=[];
    for (let i=0; i<this.state.response.length; i++) {
      wineNameList.push(this.state.response[i].name);
      wineImagePathList.push(this.state.response[i].picture);
      wineStrArray.push(JSON.stringify(this.state.response[i])); //stringify the wine object
    }

    //The following can only be done from the constructor
    let extractedInfo = {
      wineNames:      wineNameList,
      wineImagePaths: wineImagePathList,
      wineStrings:    wineStrArray
    }

    this.state = Object.assign(this.state, extractedInfo);
  }

  
  getWineAPI() {

    this.setState({ response: wineData }); 
    this.loadWineInfo();

  }

  addNewWineData(wineStr) {  //call back to post new wine obj to remote
    
    let wineObj=JSON.parse(wineStr);
    
    let newResponse=this.state.response;
    let newWineStrings=this.state.wineStrings;
    let newWineImgPaths=this.state.wineImagePaths;
    let newWineNames=this.state.wineNames;

    newResponse.push(wineObj);
    newWineStrings.push(wineStr);
    newWineImgPaths.push(wineObj.picture);
    newWineNames.push(wineObj.name);

    this.setState( {response: newResponse});
    this.setState( {wineNames: newWineNames});
    this.setState( {wineImagePaths: newWineImgPaths});
    this.setState( {wineStrings: newWineStrings});

  }
  deleteWineData(wineIdObj) { //call back to delete wine object from remote

    let wineId=wineIdObj.value;
    let newResponse=this.state.response;
    let newWineStrings=this.state.wineStrings;
    let newWineImgPaths=this.state.wineImagePaths;
    let newWineNames=this.state.wineNames;
    for (let i=0; i<newWineStrings.length; i++) {
      let wineObj=JSON.parse(newWineStrings[i])
      if (wineId==wineObj.id) {
        //delete the object from state
        newWineStrings.splice(i, 1);
        newWineNames.splice(i, 1);
        newWineImgPaths.splice(i, 1);
        newResponse.splice(i, 1);

        break;
      }
    }

    this.setState( {response: newResponse});
    this.setState( {wineNames: newWineNames});
    this.setState( {wineImagePaths: newWineImgPaths});
    this.setState( {wineStrings: newWineStrings});

  }

  displayWineImgAndInfo(wine, id) {

    if (wine === undefined) {
      return "";
    }

    return (
      <div className="wineCard">
        <p className="wineName">{wine.name}</p>

        <Link to={{
                    pathname:  "/WineForm",
                    wineStrings:  this.state.wineStrings,
                    idx:       id,
                    wineRowId: "wineRow",
                    createWineCallBack: this.addNewWineData,
                    deleteWineCallBack: this.deleteWineData
                  }}>
              <img className="wineImg" src={wine.picture} /> 
        </Link>

        <p className="wineDetail"> Country: {wine.country} </p>
        <p className="wineDetail"> Year: {wine.year}  </p>
        <p className="wineDetail"> Price: ${wine.price}</p>
      </div>
    )
  }

  render() {

    return (
      <div>
        <p className="wineListText" >Wine List</p>

        <Router>

          {/* Render wine list */}
          <nav>
            <ul id="wineRow">
              <li>
                { this.state.response.map( this.displayWineImgAndInfo) }
              </li>
            </ul>
          </nav>

          {/* Route to WineForm */}
          <Switch>
            <Route exact path="/WineForm" component={WineForm} />
          </Switch>

        </Router>

      </div>
  )}
}