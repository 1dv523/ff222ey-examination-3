'use strict'
import { doNotify } from './notis.js'
export const socket = window.io()

const sessionStorageName = 'theIssuerNotis'
const sessionStorageName2 = 'theIssuerId'
let allNotis = window.sessionStorage.getItem(sessionStorageName)
let ids = window.sessionStorage.getItem(sessionStorageName2)
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
<a href="#">
  <div class="toast-body"></div>
</a>
</div>
`
let counter = 0

if (allNotis) {
  allNotis = JSON.parse(allNotis)
  if (allNotis.length > 0) {
    displayNotis(allNotis)
  }
}

if (ids) {
  ids = parseInt(ids, 10)
} else {
  ids = 0
}

socket.on('issue_comment', (data) => {
  allNotis = window.sessionStorage.getItem(sessionStorageName)
  if (allNotis) {
    allNotis = JSON.parse(allNotis)
  } else {
    allNotis = []
  }
  const mess = {}
  counter++
  ids++
  const alert = template.cloneNode(true)
  alert.className += ' space'
  alert.setAttribute('id', ids)
  const body = alert.querySelector('.toast-body')
  const heading = alert.querySelector('.headings')
  const span = document.createElement('span')
  const aTag = alert.querySelector('a')
  alert.style.order = counter * -1
  let url
  aTag.setAttribute('data-id', ids)
  if (data.organization) {
    url = `/${data.sender.login}/repo/${data.repository.owner.login}/issues/${data.issue.number}/${data.repository.name}/comments`
    aTag.setAttribute('href', `/${data.sender.login}/repo/${data.repository.owner.login}/issues/${data.issue.number}/${data.repository.name}/comments`)
  } else {
    url = `/${data.sender.login}/repo/issues/${data.issue.number}/${data.repository.name}/comments`
    aTag.setAttribute('href', `/${data.sender.login}/repo/issues/${data.issue.number}/${data.repository.name}/comments`)
  }
  const ptag = document.createElement('label')
  span.className = 'font-weight-bold'
  const span2 = span.cloneNode(true)
  const img = alert.querySelector('.img')
  const del = alert.querySelector('.del')
  del.setAttribute('data-id', ids)
  aTag.setAttribute('data-id', ids)
  img.setAttribute('src', data.sender.avatar_url)
  notis.textContent = counter
  if (data.action === 'deleted') {
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
  mess.id = ids
  mess.url = url
  if (document.hidden) {
    doNotify(heading.textContent, `${span.textContent}${ptag.textContent}${span2.textContent}`, data.sender.avatar_url, url)
  }
  notisBar.append(alert)
  allNotis.push(mess)
  allNotis = JSON.stringify(allNotis)
  window.sessionStorage.setItem(sessionStorageName, allNotis)
  window.sessionStorage.setItem(sessionStorageName2, ids)

  window.$(del).click(deleteThis)
  window.$(aTag).click(deleteThis)
})

socket.on('issues', function (data) {
  allNotis = window.sessionStorage.getItem(sessionStorageName)
  if (allNotis) {
    allNotis = JSON.parse(allNotis)
  } else {
    allNotis = []
  }
  const mess = {}
  counter++
  ids++
  const alert = template.cloneNode(true)
  alert.className += ' space'
  const body = alert.querySelector('.toast-body')
  const heading = alert.querySelector('.headings')
  const img = alert.querySelector('.img')
  const del = alert.querySelector('.del')
  const aTag = alert.querySelector('a')
  alert.style.order = counter * -1
  let url
  aTag.setAttribute('data-id', ids)
  if (data.organization) {
    url = `/${data.sender.login}/repo/${data.repository.owner.login}/issues/${data.repository.name}/`
    aTag.setAttribute('href', `/${data.sender.login}/repo/${data.repository.owner.login}/issues/${data.repository.name}/`)
  } else {
    url = `/${data.sender.login}/repo/${data.repository.owner.login}/issues/${data.repository.name}`
    aTag.setAttribute('href', `/${data.sender.login}/repo/${data.repository.owner.login}/issues/${data.repository.name}`)
  }
  const span = document.createElement('span')
  const ptag = document.createElement('label')
  span.className = 'font-weight-bold'
  const span2 = span.cloneNode(true)
  aTag.setAttribute('data-id', ids)
  del.setAttribute('data-id', ids)
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
  mess.id = ids
  mess.repo = data.repository.full_name
  mess.notisType = 'issue'
  mess.url = url

  allNotis.push(mess)
  allNotis = JSON.stringify(allNotis)
  window.sessionStorage.setItem(sessionStorageName, allNotis)
  window.sessionStorage.setItem(sessionStorageName2, ids)

  window.$(del).click(deleteThis)
  window.$(aTag).click(deleteThis)
  notisBar.append(alert)
  if (document.hidden) {
    doNotify(heading.textContent, `${span.textContent}${ptag.textContent}${span2.textContent}`, data.sender.avatar_url, url, ids)
  }
})

function deleteThis (e) {
  let id = e.currentTarget.getAttribute('data-id')
  const div = document.getElementById(id)
  id = parseInt(id, 10)
  remove(id)
  div.remove()
}

export function deleteThat (id) {
  const div = document.getElementById(id)
  id = parseInt(id, 10)
  remove(id)
  div.remove()
}

function displayNotis (arr) {
  counter = arr.length
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
    const aTag = alert.querySelector('a')
    aTag.setAttribute('href', element.url)
    aTag.setAttribute('data-id', element.id)
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
    window.$(aTag).click(deleteThis)
    notisBar.append(alert)
  })
}

window.addEventListener('beforeunload', function (e) {
  socket.disconnect()
})

function remove (id) {
  allNotis = window.sessionStorage.getItem(sessionStorageName)
  allNotis = JSON.parse(allNotis)
  allNotis = allNotis.filter(e => e.id !== id)
  allNotis = JSON.stringify(allNotis)
  window.sessionStorage.setItem(sessionStorageName, allNotis)
  window.sessionStorage.setItem(sessionStorageName2, allNotis.length)
  counter-- // chekc
  if (counter === 0) {
    notis.textContent = ''
  } else {
    notis.textContent = counter
  }
}
