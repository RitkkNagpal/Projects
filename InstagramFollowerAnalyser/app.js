const puppeteer=require("puppeteer");
const id="robbyabagnale__";
const pwd="CatchMeIfYouCan";

const fs=require("fs");
let numFollowers;
let numFollowings;

(async function(){
    let browser = await puppeteer.launch({ //to open browser
        headless: false,
        defaultViewport: null, 
        args: ["--start-maximized"],
    });

    let pages = await browser.pages();
    let tab=pages[0];//selecting first tab
    await tab.goto("https://www.instagram.com"); //going to the instagram page

    //typing necessary login credentials then clicking login button
    await tab.waitForSelector('input[aria-label="Phone number, username, or email"]',{visible:true});
    await tab.type(' input[aria-label="Phone number, username, or email"]',id);
    await tab.type(' input[aria-label="Password"]',pwd);
    await tab.click('button[type="submit"]');
    
    await tab.waitForSelector(".MWDvN.nfCOa ._2dbep.qNELH"); //profile icon
    await tab.click(".MWDvN.nfCOa ._2dbep.qNELH");

    //clicking profile link
    await tab.waitForSelector('._01UL2 a[href="/robbyabagnale__/"]');
    tab.click('._01UL2 a[href="/robbyabagnale__/"]');
    await tab.waitForSelector('.k9GMp li .g47SY');
    let profileInfo=await tab.$$('.k9GMp li .g47SY ');
    numFollowers=await tab.evaluate(function(elem){ return elem.textContent; },profileInfo[1]);
    numFollowings=await tab.evaluate(function(elem){ return elem.textContent; },profileInfo[2]);


    let allFollowingNamesArray=await getNamesArray(profileInfo[2],tab,".FPmhX",numFollowings);
    let closeButton=await tab.$('svg[aria-label="Close"]');
    closeButton.click();
    let allFollowerNamesArray=await getNamesArray(profileInfo[1],tab,".FPmhX",numFollowers);
    console.log("Followings : " + allFollowingNamesArray);

    console.log("***********---------------------------------------------**************")
    
    console.log("Followers : "+allFollowerNamesArray);
    let peopleNotFollowingYouArray=allFollowingNamesArray.filter(function(name){
        return !allFollowerNamesArray.includes(name);
    });
    let peopleYouAreNotFollowingArray=allFollowerNamesArray.filter(function(name){
        return !allFollowingNamesArray.includes(name);
    });
    console.log("fans : "+peopleYouAreNotFollowingArray);
    





    if(!fs.existsSync(`./user_Data/${id}`))
    {
        //create a directory with username if it doesn't exist
        fs.mkdirSync(`./user_Data/${id}`);
    }
    if(!fs.existsSync(`./user_Data/${id}/${id}.json}`))
    {
        //create the file and write content in it
        let userData={
        'followers' : numFollowers,
        'followings' : numFollowings,
        'followerNames' : allFollowerNamesArray,
        'followingNames' : allFollowingNamesArray,
        'fans' : peopleYouAreNotFollowingArray,
        'celebrities' : peopleNotFollowingYouArray,
        'gainedFollowers' : 0,
        'lostFollowers' : 0
        }

        fs.writeFileSync(`./user_Data/${id}/${id}.json`,JSON.stringify(userData));
    }
    else{
        //update the contents
        await updateFileContents(numFollowers,numFollowings,allFollowerNamesArray,allFollowingNamesArray,peopleYouAreNotFollowingArray,peopleNotFollowingYouArray);
    }

    browser.close();
})();

async function scrollDown(elem,tab){
    tab.evaluate(function(elem){
        let totalHeight=0;
        let distance=100;
        const delay=100;
        let timer=setInterval(()=>{
            elem.scrollBy(0,distance);
            totalHeight+=distance;
            if(totalHeight>=elem.scrollHeight){
                clearInterval(timer);
            }
        },delay);
    },elem);
}

async function getNamesArray(elem,tab,selector,num)
{
    await elem.click();
    let allNamesContainer= await tab.waitForSelector('.isgrP');

    await scrollDown(allNamesContainer,tab);
    await tab.waitForTimeout(10000);
    await tab.waitForSelector(selector);
    let allNames=await tab.$$(selector);
    let allNamesArray=[];
    for(let i=0;i<num;i++){
        
        let singleName=await tab.evaluate(function(elem){return elem.textContent},allNames[i]);
        allNamesArray.push(singleName);
    }
    return allNamesArray;
}

async function updateFileContents(numFollowers,numFollowings,allFollowerNamesArray,allFollowingNamesArray,peopleYouAreNotFollowingArray,peopleNotFollowingYouArray)
{
    let fileData=JSON.parse(fs.readFileSync(`./user_Data/${id}/${id}.json`));
    numFollowers=Number(numFollowers);
    numFollowings=Number(numFollowings);

    let previousFollowers=Number(fileData.followers);
    fileData.followers=numFollowers;
    fileData.followings=numFollowings;
    fileData.followerNames=allFollowerNamesArray;
    fileData.followingNames=allFollowerNamesArray;
    
    if(numFollowers>previousFollowers)
        fileData.gainedFollowers=numFollowers-previousFollowers;
    else
    {
        fileData.lostFollowers=previousFollowers-numFollowers;
    }

    fileData.fans=peopleYouAreNotFollowingArray;
    fileData.celebrities=peopleNotFollowingYouArray;

    fs.writeFileSync(`./user_Data/${id}/${id}.json`,JSON.stringify(fileData));
}

