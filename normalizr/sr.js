const normalize = require('normalizr').normalize;
const schema = require('normalizr').schema;



const originalData = {
  "id": "123",
  "author": {
    "id": "1",
    "name": "Paul"
  },
  "title": "My awesome blog post",
  "comments": [
    {
      "id": "324",
      "commenter": {
        "id": "2",
        "name": "Nicole"
      }
    }
  ]
};

const originalData = {
    id: 'T170526001',
    srNo: 'T170526001',
    regpe: {
        id: '123415123',
        sabun: '123415123',
        name: '박새놀'
    },
    title: '이것은 타이틀입니다.',
    subsrs: [
        {   
            id: 'T170526001_001',
            subsrNo: 'T170526001_001',
            progStat: '140',
            chngChrpe: {
                id: '5123123',
                sabun: '5123123',
                name: '김상민'
            }
        },
        {
            id: 'T170526001_002',
            subsrNo: 'T170526001_002',
            protStat: '141',
            chngChrpe: {
                id: '1412312',
                sabun: '1412312',
                name: '손승현'
            }
        }
    ],
    progStat: {
        '140': '진행 중',
        '141': '완료'
    }
}

const user = new schema.Entity('users', );

const progStat = new schema.Entity('progStat');

const subsrs = new schema.Entuty('subsrs', {
    chngChrpe: user
});

const sr = 

// Define a users schema
const user = new schema.Entity('users');

// Define your comments schema
const comment = new schema.Entity('comments', {
  commenter: user
});

// Define your article 
const article = new schema.Entity('articles', { 
  author: user,
  comments: [ comment ]
});

const normalizedData = normalize(originalData, article);


console.log(normalizedData);