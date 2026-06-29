const BUILD_NAME='YardBoss-V2-Build03-Academy500';
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
 return{rank,tier,title:RANK_TITLES[i],target:rank*100,xpRequired:1000,taskRequired:5,academyRequired:5};
});

const TASKS=[
{id:'wake',label:'Start the day with intention',xp:100},
{id:'tools',label:'Organize tools or workspace',xp:100},
{id:'customer',label:'Contact or follow up with one customer',xp:100},
{id:'plan',label:'Plan tomorrow',xp:100},
{id:'discipline',label:'Do one discipline task',xp:100}
];

const LESSONS=[
{
 id:'income',
 word:'Income',
 words:[
  {term:'Income',def:'Money coming in.'},
  {term:'Pay',def:'Money received for work.'},
  {term:'Earnings',def:'Total money made before spending.'}
 ],
 examples:'Nick mows a yard and gets paid $80. That $80 is income. If he does two jobs and gets $80 plus $120, his income is $200.',
 implementation:'When Nick gets paid, he should enter the pay amount in Yard Boss, then decide how much goes into the envelope before spending any of it.',
 fact:'A business can have income and still lose money if expenses are higher than what came in.',
 question:'What is income?',
 answers:['Money you earn','Money you owe','Money you spend'],
 correct:0
},
{
 id:'expense',
 word:'Expense',
 words:[
  {term:'Expense',def:'Money going out.'},
  {term:'Cost',def:'The price paid for something.'},
  {term:'Supplies',def:'Things used to complete work.'}
 ],
 examples:'Gas, string, oil, and replacement tools are expenses because money leaves Nick’s pocket to keep the work going.',
 implementation:'Before spending from job money, Nick should ask: is this expense helping me earn more, or is it just draining cash?',
 fact:'Small expenses can quietly eat a business if they are not tracked.',
 question:'Which one is an expense?',
 answers:['Buying gas','Getting paid','Saving money'],
 correct:0
},
{
 id:'profit',
 word:'Profit',
 words:[
  {term:'Profit',def:'Money left after expenses.'},
  {term:'Revenue',def:'Money made before expenses.'},
  {term:'Net',def:'What is left after costs.'}
 ],
 examples:'Nick earns $100 mowing. Gas and string cost $20. His profit is $80.',
 implementation:'After every job, Nick should subtract job costs from pay so he knows what he actually made.',
 fact:'Profit matters more than looking busy.',
 question:'You earn $100 and spend $20. Profit is...',
 answers:['$20','$80','$100'],
 correct:1
},
{
 id:'asset',
 word:'Asset',
 words:[
  {term:'Asset',def:'Something useful or valuable that helps make money.'},
  {term:'Tool',def:'Equipment used to do work.'},
  {term:'Value',def:'What something is worth.'}
 ],
 examples:'A mower, trailer, weed eater, or savings envelope can be an asset if it helps Nick earn or protect money.',
 implementation:'Nick should protect and maintain tools because broken assets stop money from coming in.',
 fact:'Good assets help make money more than once.',
 question:'Which is an asset?',
 answers:['Mower','Electric bill','Gas receipt'],
 correct:0
},
{
 id:'bill',
 word:'Bill',
 words:[
  {term:'Bill',def:'Money that must be paid.'},
  {term:'Due Date',def:'The date payment is expected.'},
  {term:'Late Fee',def:'Extra money charged for paying late.'}
 ],
 examples:'Phone, insurance, truck payment, and electric are bills because they must be paid on time.',
 implementation:'Nick should know which bills are coming before spending job money.',
 fact:'Avoiding late fees is like giving yourself free money.',
 question:'Which is a bill?',
 answers:['Customer payment','Electric payment','Boss coins'],
 correct:1
}
];

const ACADEMY_STEPS=[
{id:'words',label:'Words and definitions',xp:100},
{id:'examples',label:'Examples / explanations',xp:100},
{id:'implementation',label:'Real-world personalized implementation',xp:100},
{id:'fact',label:'Interesting, fun, or useful fact',xp:100},
{id:'quiz',label:'Review Quiz',xp:100}
];

const BOOKS=[
 {title:'Book I',name:'The Apprentice',tier:'Bronze'},
 {title:'Book II',name:'The Craftsman',tier:'Silver'},
 {title:'Book III',name:'The Builder',tier:'Gold'},
 {title:'Book IV',name:'The Master Builder',tier:'Diamond'},
 {title:'Book V',name:'The Guardian',tier:'Platinum'},
 {title:'Book VI',name:'The Legacy',tier:'Onyx'}
];

const BUILDER_CODES=[
 {theme:'Discipline',quote:'Labor is the price which Providence has fixed upon every valuable thing.',source:'Benjamin Franklin, historical Freemason',meaning:'Nothing valuable is built without work. Every saved dollar, finished task, and lesson completed is part of the price of freedom.',vocab:[['Labor','Work done with the body or mind.'],['Providence','A higher guiding order, destiny, or divine care.'],['Valuable','Something worth protecting because it improves life.']],reflection:'A boss is not built by one big move. He is built by repeating the right action when nobody is forcing him to do it.',reminder:'Build the man behind the boss.'},
 {theme:'Fortitude',quote:'Be thou strong, therefore, and show thyself a man.',source:'1 Kings 2:2, a virtue-centered passage often echoed in fraternal teachings',meaning:'Strength is not only muscle. It is the ability to keep going when the easy choice is to quit.',vocab:[['Fortitude','Courage and strength during difficulty.'],['Virtue','A strong moral quality.'],['Resolve','A firm decision not to give up.']],reflection:'When Nick keeps saving even when he wants to spend, he is training fortitude.',reminder:'Strength is proven by follow-through.'},
 {theme:'Industry',quote:'Diligence is the mother of good luck.',source:'Benjamin Franklin, historical Freemason',meaning:'Luck often shows up after preparation. The harder a man works with focus, the more opportunities he notices and uses.',vocab:[['Industry','Steady, focused work.'],['Diligence','Careful effort repeated over time.'],['Opportunity','A chance to move forward.']],reflection:'A quiet day can still build the boss if tools are cleaned, customers are contacted, and tomorrow is planned.',reminder:'Work creates openings.'},
 {theme:'Prudence',quote:'Take time for all things: great haste makes great waste.',source:'Benjamin Franklin, historical Freemason',meaning:'Rushing causes mistakes. Wise decisions protect money, tools, time, and reputation.',vocab:[['Prudence','Wisdom before action.'],['Haste','Moving too fast without thinking.'],['Waste','Losing money, time, or materials unnecessarily.']],reflection:'Before spending from a job, pause and decide what belongs in the envelope first.',reminder:'Think before the money moves.'},
 {theme:'Fidelity',quote:'Not unto us, O Lord, not unto us, but unto thy name give glory.',source:'Templar motto from Psalm 115:1',meaning:'Do the work with humility. The goal is not showing off. The goal is becoming trustworthy and useful.',vocab:[['Fidelity','Loyalty and faithfulness to a promise.'],['Humility','Strength without bragging.'],['Glory','Honor or praise.']],reflection:'A real boss keeps his word, finishes the job, and lets the results speak.',reminder:'Keep faith with the man you are building.'}
];

function getBuilderCode(index){return BUILDER_CODES[index % BUILDER_CODES.length];}
function getBookForEnvelope(index){return BOOKS[Math.floor(index/5)] || BOOKS[BOOKS.length-1];}
