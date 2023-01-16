
fetch('http://localhost:8080/admin')
  .then((response) => response.json())
  .then((obj) => {
    if (obj.status === "success") {
      let resultData = changeData(obj.onedaydata);
      let plz = changeData(obj.alldata);

      //console.log(obj.plz);
      document.querySelector("#attendance").innerHTML = resultData.common;
      document.querySelector("#tardy").innerHTML = resultData.late;
      document.querySelector("#sick-absent").innerHTML = resultData.sick;
      document.querySelector("#absent").innerHTML = resultData.absent;

      drawCircleChart(resultData.common, resultData.absent, resultData.late,
        resultData.already, resultData.sick);
      
      drawMixChart(plz.weekend);

  } else {
    location.href = "404.html";
    return;
  }    
})
  .catch((err) => {
    console.log(err);});



function changeData(array) {
  let common = 0;
  let late = 0;
  let sick = 0;
  let absent = 0;
  let already = 0;
  let weekData = [[0,0],[0,0],[0,0],[0,0],[0,0]];
  var count = 0;
  for (let a of array) {
    console.log(a.name);
    for (let b in a.attendance.attendances) {      
      let c = a.attendance.attendances[b];
        if (c == null) {
          absent++;
        } else if (c.absent) {
          if (c.absentType === 0) {
            absent++;
          } else if ((c.absentType === 1)) {
            sick++;
          }
          weekData[count][1]++;
        } else {
          if (c.inTime >= 9.5) {
            late++;
          } else if (c.outTime <= 18) {
            already++;
          } else {
            common++;
          }     
          weekData[count][0]++;
        }
        count++;
        if (count === 5) {
          count = 0;
        }
        }
      }          
  return {
    "common" : common,
    "late" : late,
    "already" : already,
    "sick" : sick,
    "absent" : absent,
    "weekend" : weekData
  }
}


function drawCircleChart(attendance, absent, late, already, sick) {
    // 파이형 차트
    ctx2 = document.getElementById("myChart2");
  
  myPieData = {
  type: 'pie',
  labels: ['출석', '결석', '지각', '조퇴', '병가'],
  datasets : [
    {
      label: ['출석', '결석', '지각', '조퇴', '병가'],
      data : [attendance, absent, late, already, sick],
      backgroundColor: ['rgba(256, 60, 40, 0.1)', 'rgba(256, 255, 10, 0.3)', 'rgba(70, 100, 100, 0.1)', 'rgba(256, 0, 100, 0.5)', 'rgba(256, 156, 100, 0.4)'],
    }],
  }

      // 가운데 구멍이 없는 파이형 차트
  myPieChart = new Chart(ctx2, {
    type: 'pie',
    data: myPieData,
    options: {}
  });
}

function drawMixChart(weekendData) {
  const ctx1 = document.getElementById('myChart1');
  const mydata = [weekendData[0][1],weekendData[1][1],weekendData[2][1],
  weekendData[3][1],weekendData[4][1]];
  const mydataHalf = [weekendData[0][0],weekendData[1][0],weekendData[2][0],
  weekendData[3][0],weekendData[4][0]];;

  mixedChart = {
  type: 'bar',
  labels: ['월요일', '화요일', '수요일', '목요일', '금요일'],
  datasets : [
    {
      label: '결석률',
      data : mydata,
      backgroundColor: 'rgba(256, 0, 0, 0.1)'
    },
    {
      label: '출석률',
      data: mydataHalf,
      backgroundColor: 'transparent',
      borderColor: 'skyblue',
      type: 'line'
    }
  ]
  };
  myChart = new Chart(ctx1, {
    type: 'bar',
    data: mixedChart,
    options: {
      legend: {
        display: true
      }
    }
  });  
}