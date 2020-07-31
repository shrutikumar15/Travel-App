function Submit(){


  const addLocationPath = 'http://localhost:5000/add'

  let today = new Date();
  let m = today.getMonth();
  let month = m+1;
  var newDate = today.getDate()+'.'+month+'.'+ today.getFullYear();

  document.getElementById('generate').addEventListener('click', performAction);

  function performAction(e){
    e.preventDefault();

    const arrivalDay = document.getElementById('arrival_day').value;
    const entry = new Date(arrivalDay);
    const time = entry.getTime();
    const Today = (new Date()).getTime();
    const diffMiliSec = Math.abs(time - Today);
    const difference = Math.ceil(diffMiliSec/(1000*60*60*24));
    const city = document.getElementById('city').value;

    postData(addLocationPath, {
      date: newDate, 
      arrival: arrivalDay, 
      daysLeft: difference,
      city: city
    });

  };

  
  const postData = async ( url = '', data = {})=>{
    const response = await fetch(url,
    // url = 'http://localhost:5000/add',
    {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),       
  });
    try {
      const data = await fetch('http://localhost:5000/all')
      try {
        const newData = await data.json();
        updateUI();
        return newData;
      } catch (error) {
        console.log("error", error);
      }
    }catch(error) {
    console.log("error", error);
    }
  };

  
  const updateUI = async()=>{
   
    const request = await fetch('http://localhost:5000/all')

    try{
      const allData = await request.json();
      console.log(allData);
      const logsNumber = allData.length;
      const lastEntry = allData[logsNumber-1];
      const city = document.getElementById('city').value;

      document.getElementById('country').innerHTML = 'Destination '+city+', in the country '+lastEntry.country;
      document.getElementById('cont').innerHTML = 'Your arrival date is '+lastEntry.arrival;
      document.getElementById('countdown').innerHTML = ''+lastEntry.daysLeft+' days left until your trip';
      document.getElementById('temp').innerHTML = 'Expected weather is '+lastEntry.temp+'&deg;C';
      
      if (lastEntry.image !== undefined ){
        document.getElementById('picture').innerHTML = '<img src='+lastEntry.image+'>';
      }

    }
    catch(error){
      console.log('error', error);
    };
  }

}

export { Submit };


