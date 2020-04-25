  
  
  const photoData=  [];
  photoData.push(
    {
      "id": 1000,
      "imageIdx": 0,
      "likes": 1,
      "dislikes": 0,
      "owner": 3000,     // id of user1
      "comments": [ 4000, 4001, 4002, 4003 ]
    }
    );
  photoData.push(
    {
      "id": 1001,
      "imageIdx": 1,
      "likes": 1,
      "dislikes": 0,
      "owner": 3000,
      "comments": [ 4004, 4005, 4006, 4007 ]
    }
    );
  photoData.push(
    {
      "id": 1002,
      "imageIdx": 2,
      "likes": 1,
      "dislikes": 0,
      "owner": 3000,
      "comments": [ 4008, 4009, 4010, 4011]
    }
    );
  photoData.push(
    {
      "id": 1003,
      "imageIdx": 3,
      "likes": 0,
      "dislikes": 1,
      "owner": 3000,
      "comments": [ 4012 ]
    }
    );
  photoData.push(
    {
      "id": 1004,
      "imageIdx": 4,
      "likes": 0,
      "dislikes": 1,
      "owner": 3000,
      "comments": [ 4013 ]
    }
    );
  photoData.push(
    {
      "id": 2000,
      "imageIdx": 9,
      "likes": 1,
      "dislikes": 0,
      "owner": 3001,     //id of user2
      "comments": [ 4014 ]
    }
    );
  photoData.push(
    {
      "id": 2001,
      "imageIdx": 10,
      "likes": 1,
      "dislikes": 0,
      "owner": 3001,
      "comments": [ 4015 ]
    }
    );
  photoData.push(
    {
      "id": 2002,
      "imageIdx": 11,
      "likes": 1,
      "dislikes": 0,
      "owner": 3001,
      "comments": [ 4016 ]
    }
    );
  photoData.push(
    {
      "id": 2003,
      "imageIdx": 12,
      "likes": 0,
      "dislikes": 1,
      "owner": 3001,
      "comments": [ 4017 ]
    }
    );
  photoData.push(
    {
      "id": 2004,
      "imageIdx": 13,
      "likes": 0,
      "dislikes": 1,
      "owner": 3001,
      "comments": [ 4018 ]
    }
    );
  /****************************************************************/
  
  const userData=[]
  userData.push(
      {
        "id": 3000,
        "userId": "user1",
        "password": "user1",
        "name":  "user1",
        "profileImgIdx": 0,
        "likePhoto": [2000, 2001, 2002],
        "dislikePhoto": [2003, 2004],
        "bookmarkedPhoto": [1000, 2000, 2001]
      }
      );
  userData.push(
      {
        "id": 3001,
        "userId": "user2",
        "password": "user2",
        "name":  "user2",
        "profileImgIdx": 1,
        "likePhoto": [1000, 1001, 1002],
        "dislikePhoto": [1003, 1004],
        "bookmarkedPhoto": [2000, 1000, 1001]
      }
      );
  userData.push(
      {
        "id": 3002,
        "userId": "user3",
        "password": "user3",
        "name":  "user3",
        "profileImgIdx": 2,
        "likePhoto": [],
        "dislikePhoto": [],
        "bookmarkedPhoto": []
      }
  );
  
  /****************************************************************/
  
  const commentData=[];
  commentData.push(
      {
        "id": 4000,
        "comment": "Easter!",
        "photo":  1000,
        "source": 3000      //id of user1
      }
      );
  commentData.push(
      {
        "id": 4001,
        "comment":  "Eggs!",
        "photo":  1001,
        "source": 3000
      }
      );
  commentData.push(
      {
        "id": 4002,
        "comment":  "Ah!",
        "photo":  1000,
        "source": 3001     //id of user2
      }
      );
  commentData.push(
      {
        "id": 4003,
        "comment":  "Candies",
        "photo":  1001,
        "source": 3001
      }
      );
  commentData.push(
      {
        "id": 4004,
        "comment": "Easter Again!", 
        "photo":  1002,
        "source": 3000
      }
      );
  commentData.push(
      {
        "id": 4005,
        "comment":  "More Eggs!",
        "photo":  1003,
        "source": 3000
      }
      );
  commentData.push(
      {
        "id": 4006,
        "comment":  "Awe!",
        "photo":  1002,
        "source": 3001
      }
      );
  commentData.push(
      {
        "id": 4007,
        "comment":  "More!",
        "photo":  1003,
        "source": 3001
      }
      );
  commentData.push(
      {
        "id": 4008,
        "comment":  "More!",
        "photo":  2000,
        "source": 3000
      }
      );
  commentData.push(
      {
        "id": 4009,
        "comment": "Easter Easter!",
        "photo":  2001,
        "source": 3000
      }
      );
  commentData.push(
      {
        "id": 4010,
        "comment":   "More More!",
        "photo":  2000,
        "source": 3001
      }
      );
  commentData.push(
      {
        "id": 4011,
        "comment":   "Awe!",
        "photo":  2001,
        "source": 3001
      }
      );
  commentData.push(
      {
        "id": 4012,
        "comment":   "Eggnog!",
        "photo":  2002,
        "source": 3000
      }
      );
  commentData.push(
      {
        "id": 4013,
        "comment":   "Eggs Eggs!",
        "photo":  2003,
        "source": 3000
      }
      );
  commentData.push(
      {
        "id": 4014,
        "comment":   "Egg mountains",
        "photo":  2002,
        "source": 3001
      }
      );
  commentData.push(
      {
        "id": 4015,
        "comment":   "Legs!",
        "photo":  2003,
        "source": 3001
      }
      );
  
  /****************************************************************/

  export default photoData;
  export {userData, commentData};
