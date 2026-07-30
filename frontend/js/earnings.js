const ctx = document.getElementById("earningsChart");

new Chart(ctx,{

type:"bar",

data:{

labels:["Jan","Feb","Mar","Apr","May","Jun","Jul"],

datasets:[{

label:"Monthly Earnings",

data:[12000,18000,15000,25000,22000,28000,24850],

backgroundColor:"#2E7D32"

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

}

}

});