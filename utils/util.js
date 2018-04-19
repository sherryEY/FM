const setTimer = (time) => {
  let min = parseInt(time/60)
  let sec = time%60
  if(min < 10){
    min = "0"+min
  }
  if(sec < 10){ 
    sec = sec+""
    sec ="0"+sec.slice(0, 1)
  }else{
    sec = sec + ""
    sec = sec.slice(0, 2)
  }
  return min+":"+sec
}

const getTimer = (time) => {
  let newTime = 0
  if(time.indexOf(':') != -1){
    let arr = time.split(':')
    newTime = parseInt(arr[0])*60+parseInt(arr[1])
  }
  else if (time.indexOf('：') != -1) {
    let arr = time.split('：')
    newTime = parseInt(arr[0]) * 60 + parseInt(arr[1])
  }
  else{
    newTime = time
  }
  return newTime
}

const textAnalysis = (text) => {
  let arr = text.split("<br>")
  // for (let i = 0; i < arr.length; i++) {
  //   if (arr[i].length <= 0 || arr[i] == ' ') {
  //     arr.splice(i, 1)
  //     i = i - 1
  //   }
  // }
  return arr
}

const textFormat = (arr) => {
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
    let item = {
      name: 'p',
      attrs: {
        class: 'lyricP',
        style: 'margin-top:50rpx;'
      }, 
      children: [{ type: 'text', text: arr[i] }] 
    }
    newArr.push(item)
  }
  return newArr
}

module.exports = {
  setTimer: setTimer,
  getTimer: getTimer,
  textAnalysis: textAnalysis,
  textFormat: textFormat
}