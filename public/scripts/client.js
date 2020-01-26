'use strict'

console.log('hello worldss')

export const socket = window.io()
const sessionStorageName = 'theIssuerNotis'
let allNotis = window.sessionStorage.getItem(sessionStorageName)
const notis = document.getElementById('notis')
const notisBar = document.getElementById('notisBar')
const template = document.createElement('div')
template.innerHTML = `
<div role="alert" aria-live="assertive" aria-atomic="true" class="toast show" data-autohide="false">
<div class="toast-header">
  <img src="..." class="rounded mr-2 img" alt="...">
  <strong class="mr-auto headings">Bootstrap</strong>
  <small id="time"> less than 1 min ago</small>
  <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
  <span aria-hidden="true" class="del" >&times;</span>
</button>
</div>
<div class="toast-body">
</div>
</div>
`
let counter = 0
let id = 0

if (allNotis) {
  allNotis = JSON.parse(allNotis)
  console.log(' ia ma hre')
  if (allNotis.length > 0) {
    console.log(allNotis)
    displayNotis(allNotis)
  }
}

socket.on('issue_comment', (data) => {
  console.log(data)
  allNotis = window.sessionStorage.getItem(sessionStorageName)
  if (allNotis) {
    allNotis = JSON.parse(allNotis)
  } else {
    allNotis = []
  }
  const mess = {}
  counter++
  id++
  const alert = template.cloneNode(true)
  alert.className += ' space'
  alert.setAttribute('id', id)
  const body = alert.querySelector('.toast-body')
  const heading = alert.querySelector('.headings')
  const span = document.createElement('span')
  const ptag = document.createElement('label')
  span.className = 'font-weight-bold'
  const span2 = span.cloneNode(true)
  const img = alert.querySelector('.img')
  const del = alert.querySelector('.del')
  del.setAttribute('data-id', id)
  img.setAttribute('src', data.sender.avatar_url)
  notis.textContent = counter
  if (data.action === 'deleted') {
    console.log(data.sender.login)
    span.textContent = `${data.sender.login} `
    body.append(span)
    ptag.textContent = ' deleted a comment on '
    body.append(ptag)
    span2.textContent = ` ${data.repository.full_name}`
    body.append(span2)
    heading.textContent = 'Comment Deleted'
  } else if (data.action === 'edited') {
    span.textContent = `${data.sender.login} `
    body.append(span)
    ptag.textContent = ' edited an issue comment on '
    body.append(ptag)
    span2.textContent = ` ${data.repository.full_name}`
    body.append(span2)
    heading.textContent = 'Comment Edited'
  } else if (data.action === 'created') {
    span.textContent = `${data.sender.login} `
    body.append(span)
    ptag.textContent = ' created a new comment on '
    body.append(ptag)
    span2.textContent = ` ${data.repository.full_name}`
    body.append(span2)
    heading.textContent = 'New Comment'
  } else {

  }
  mess.type = data.action
  mess.author = data.sender.login
  mess.heading = heading.textContent
  mess.body = ptag.textContent
  mess.img = data.sender.avatar_url
  mess.repo = data.repository.full_name
  mess.id = id
  console.log(allNotis)

  window.$(del).click(deleteThis)
  notisBar.append(alert)
  allNotis.push(mess)
  allNotis = JSON.stringify(allNotis)
  window.sessionStorage.setItem(sessionStorageName, allNotis)
})

socket.on('issues', function (data) {
  console.log(data)
  allNotis = window.sessionStorage.getItem(sessionStorageName)
  allNotis = JSON.parse(allNotis)
  const mess = {}
  counter++
  id++
  const alert = template.cloneNode(true)
  alert.className += ' space'
  const body = alert.querySelector('.toast-body')
  const heading = alert.querySelector('.headings')
  const img = alert.querySelector('.img')
  const del = alert.querySelector('.del')
  const span = document.createElement('span')
  const ptag = document.createElement('label')
  span.className = 'font-weight-bold'
  const span2 = span.cloneNode(true)
  del.setAttribute('data-id', id)
  img.setAttribute('src', data.sender.avatar_url)
  notis.textContent = counter

  if (data.action === 'edited') {
    span.textContent = `${data.sender.login} `
    body.append(span)
    ptag.textContent = ' edited an issue name on '
    body.append(ptag)
    span2.textContent = ` ${data.repository.full_name}`
    body.append(span2)
    heading.textContent = 'Issue edited'
  } else if (data.action === 'closed') {
    span.textContent = `${data.sender.login} `
    body.append(span)
    ptag.textContent = ' closed an issue on '
    body.append(ptag)
    span2.textContent = ` ${data.repository.full_name}`
    body.append(span2)
    heading.textContent = 'Issue closed'
  } else if (data.action === 'reopened') {
    span.textContent = `${data.sender.login} `
    body.append(span)
    ptag.textContent = ' reopened an issue on '
    body.append(ptag)
    span2.textContent = ` ${data.repository.full_name}`
    body.append(span2)
    heading.textContent = 'Issue reopened'
  } else if (data.action === 'opened') {
    span.textContent = `${data.sender.login} `
    body.append(span)
    ptag.textContent = ' created a new issue on '
    body.append(ptag)
    span2.textContent = ` ${data.repository.full_name}`
    body.append(span2)
    heading.textContent = 'New issue'
  } else {

  }
  mess.type = data.action
  mess.author = data.sender.login
  mess.heading = heading.textContent
  mess.body = ptag.textContent
  mess.img = data.sender.avatar_url
  mess.id = id
  mess.repo = data.repository.full_name
  mess.notisType = 'issue'


  allNotis.push(mess)
  allNotis = JSON.stringify(allNotis)
  window.sessionStorage.setItem(sessionStorageName, allNotis)

  window.$(del).click(deleteThis)
  notisBar.append(alert)
})

function deleteThis (e) {
  let id = e.target.getAttribute('data-id')
  console.log(id)
  const div = document.getElementById(id)
  id = parseInt(id, 10)
  allNotis = window.sessionStorage.getItem(sessionStorageName)
  allNotis = JSON.parse(allNotis)
  console.log(allNotis)
  allNotis = allNotis.filter(e => e.id !== id)
  allNotis = JSON.stringify(allNotis)
  window.sessionStorage.setItem(sessionStorageName, allNotis)
  div.remove()
  counter--
  if (counter === 0) {
    notis.textContent = ''
  } else {
    notis.textContent = counter
  }
}

function displayNotis (arr) {
  arr.forEach(element => {
    const alert = template.cloneNode(true)
    alert.className += ' space'
    const body = alert.querySelector('.toast-body')
    const heading = alert.querySelector('.headings')
    const img = alert.querySelector('.img')
    const del = alert.querySelector('.del')
    const span = document.createElement('span')
    const ptag = document.createElement('label')
    alert.setAttribute('id', element.id)
    span.className = 'font-weight-bold'
    const span2 = span.cloneNode(true)
    counter = arr.length
    if (counter === 0) {
      notis.textContent = ''
    } else {
      notis.textContent = counter
    }
    if (element.type === 'edited') {
      if (element.notisType === 'issue') {
        del.setAttribute('data-id', element.id)
        img.setAttribute('src', element.img)
        span.textContent = `${element.author} `
        body.append(span)
        ptag.textContent = ' edited an issue name on '
        body.append(ptag)
        span2.textContent = ` ${element.repo}`
        body.append(span2)
        heading.textContent = 'Issue edited'
      } else {
        del.setAttribute('data-id', element.id)
        img.setAttribute('src', element.img)
        span.textContent = `${element.author} `
        body.append(span)
        ptag.textContent = ' edited a comment on '
        body.append(ptag)
        span2.textContent = ` ${element.repo}`
        body.append(span2)
        heading.textContent = 'Comment edited'
      }
    } else if (element.type === 'created') {
      del.setAttribute('data-id', element.id)
      img.setAttribute('src', element.img)
      span.textContent = `${element.author} `
      body.append(span)
      ptag.textContent = ' created a new comment on '
      body.append(ptag)
      span2.textContent = ` ${element.repo}`
      body.append(span2)
      heading.textContent = 'New Comment'
    } else if (element.type === 'deleted') {
      del.setAttribute('data-id', element.id)
      img.setAttribute('src', element.img)
      span.textContent = `${element.author} `
      body.append(span)
      ptag.textContent = ' deleted a comment on '
      body.append(ptag)
      span2.textContent = ` ${element.repo}`
      body.append(span2)
      heading.textContent = 'Comment deleted'
    } else if (element.type === 'reopened') {
      del.setAttribute('data-id', element.id)
      img.setAttribute('src', element.img)
      span.textContent = `${element.author} `
      body.append(span)
      ptag.textContent = ' reopened an issue on '
      body.append(ptag)
      span2.textContent = ` ${element.repo}`
      body.append(span2)
      heading.textContent = 'Issue reopened'
    } else if (element.type === 'opened') {
      del.setAttribute('data-id', element.id)
      img.setAttribute('src', element.img)
      span.textContent = `${element.author} `
      body.append(span)
      ptag.textContent = ' created a new issue on '
      body.append(ptag)
      span2.textContent = ` ${element.repo}`
      body.append(span2)
      heading.textContent = 'New issue'
    } else if (element.type === 'closed') {
      del.setAttribute('data-id', element.id)
      img.setAttribute('src', element.img)
      span.textContent = `${element.author} `
      body.append(span)
      ptag.textContent = ' closed an issue on '
      body.append(ptag)
      span2.textContent = ` ${element.repo}`
      body.append(span2)
      heading.textContent = 'Issue closed'
    }
    window.$(del).click(deleteThis)
    notisBar.append(alert)
  })
}

window.addEventListener('beforeunload', function (e) {
  socket.disconnect()
})

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
