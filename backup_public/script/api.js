
export async function getData(url="/playground/circle") {
    const API_BASE = "http://localhost:3000"+url;
    try{
      const response = await fetch(API_BASE);
      if(response.ok)
        return await response.json();

        
      const errorData = await response.json();
      
      if (response.status === 404) {//not found
        console.warn(`แจ้งเตือน: ${errorData.message}`);
        return null;
      }else if(response.status >= 500) {//server error
        console.error(`Server error: ${errorData.message}`);
        throw new Error(`${response.status} - ${errorData.message}`);
      }
      debugger;//something went wrong with the request
      throw new Error(`Request failed with status ${response.status}: ${errorData.message}`);
        
    }catch(error){
         console.error("Error:", error.message);
         debugger;
         throw error
    }
}

export async function postData(url='/func/test', data) {
    url = url.charAt(0) !== '/' ? '/'+url : url;
    url = 'http://localhost:3000'+url;

  try {
    const response = await fetch(url, {
      method: 'POST', // Specify the HTTP method as POST
      headers: {
        'Content-Type': 'application/json' // Indicate the content type of the body
      },
      body: JSON.stringify(data) // Convert the JavaScript object to a JSON string
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json(); // Parse the JSON response
    // console.log('Success:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error for further handling
  }
}

/** allYear, thisYear, yearly and tableOutput
 * @param {object} object - {thisYear:68, month:0-11, day:1-16}
 * @returns {Promise} {reports: {allYear, thisYear, yearly}, tableOutput}*/
export async function getReports({thisYear = 68, month='0-11', day='1-16'}) {
if(!thisYear || Number.isFinite(thisYear*1) === false) throw new Error('Invalid year='+thisYear);
  const y = `${(thisYear*1) - 10}-${(thisYear*1)-1}`;
  const {reports, tableOutput} = await getData(`/output/tableOutput?y=${y}&m=${month}&d=${day}`);
  // debugger;
  return {reports, tableOutput};
}

