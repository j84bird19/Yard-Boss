const BUILD_NAME='YardBoss-V2-Build02-FULL';
const TIERS=[
{name:'Bronze',ranks:[1,2,3,4,5]},
{name:'Silver',ranks:[6,7,8,9,10]},
{name:'Gold',ranks:[11,12,13,14,15]},
{name:'Diamond',ranks:[16,17,18,19,20]},
{name:'Platinum',ranks:[21,22,23,24,25]},
{name:'Onyx',ranks:[26,27,28,29,30]}
];

const RANK_TITLES=['Hustler','Grinder','Worker','Builder','Determined','Professional','Specialist','Expert','Leader','Advanced','Elite','Master','Champion','Legend','Icon','Diamond','Diamond Pro','Diamond Elite','Diamond Master','Diamond Icon','Platinum','Platinum Pro','Platinum Elite','Platinum Master','Platinum Icon','Onyx','Onyx Pro','Onyx Elite','Onyx Master','Onyx Legend'];

const ENVELOPES=Array.from({length:30},(_,i)=>{
 const rank=i+1;
 const tier=TIERS.find(t=>t.ranks.includes(rank)).name;
 return{rank,tier,title:RANK_TITLES[i],target:rank*100,xpRequired:125,taskRequired:5,academyRequired:1};
});

const TASKS=[
{id:'wake',label:'Start the day with intention',xp:25},
{id:'tools',label:'Organize tools or workspace',xp:25},
{id:'customer',label:'Contact or follow up with one customer',xp:25},
{id:'plan',label:'Plan tomorrow',xp:25},
{id:'discipline',label:'Do one discipline task',xp:25}
];

const LESSONS=[
{id:'income',word:'Income',definition:'Income is money you receive.',question:'What is income?',answers:['Money you earn','Money you owe','Money you spend'],correct:0,xp:25},
{id:'expense',word:'Expense',definition:'An expense is money you spend.',question:'Which one is an expense?',answers:['Buying gas','Getting paid','Saving money'],correct:0,xp:25},
{id:'profit',word:'Profit',definition:'Profit is what is left after expenses.',question:'You earn $100 and spend $20. Profit is...',answers:['$20','$80','$100'],correct:1,xp:25},
{id:'asset',word:'Asset',definition:'An asset is something that has value or helps make money.',question:'Which is an asset?',answers:['Mower','Electric bill','Gas receipt'],correct:0,xp:25},
{id:'bill',word:'Bill',definition:'A bill is money you have to pay.',question:'Which is a bill?',answers:['Customer payment','Electric payment','Boss coins'],correct:1,xp:25}
];
