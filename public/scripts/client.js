'use strict'

console.log('hello worldss')

var socket = io() // your initialization code here.
console.log('i am here lol')
socket.connect('http://localhost:4567')

// const socket = window.io.connect('http://localhost:4567')
// const socket = io.connect('http://cscloud702.lnu.se.')
// socket.on('message', function (data) {
//   console.log('message arrivede')
//   console.log(data)
//   // const p = document.getElementsByTagName('p')[0]
  // console.log(p)
  // p.textContent = data.message
// })

/*
if ('Notification' in window) {
  if (window.Notification.permission === 'granted') {
    // If it's okay let's create a notification
    doNotify()
  } else {
    // notification == denied
    window.Notification.requestPermission()
      .then(function (result) {
        console.log(result) // granted || denied
        if (window.Notification.permission === 'granted') {
          doNotify()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

function doNotify () {
  const title = 'The Title'
  const t = Date.now() + 120000 // 2 mins in future
  const options = {
    body: 'Hello from JavaScript!',
    data: { prop1: 123, prop2: 'Steve' },
    lang: 'en-CA',
    icon: './img/calendar-lg.png',
    timestamp: t,
    vibrate: [100, 200, 100]
  }
  const n = new window.Notification(title, options)
  n.addEventListener('show', function (ev) {
    console.log('SHOW', ev.currentTarget.data)
  })
  n.addEventListener('close', function (ev) {
    console.log('CLOSE', ev.currentTarget.body)
  })
  setTimeout(n.close.bind(n), 3000) // close notification after 3 seconds
}
*/
