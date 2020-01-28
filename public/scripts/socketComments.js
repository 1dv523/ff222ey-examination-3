import { socket } from './client.js'
const ul = document.querySelector('#comments-list')
const liAuthor = document.createElement('li')
const li = document.createElement('li')
let token
li.className = 'child'
liAuthor.className = 'child'
let counter = 0
liAuthor.innerHTML = `
<div class="comment-main-level">
<!-- Avatar -->
  <div class="comment-avatar"><img class="pic" src="{{this.img}}" alt=""></div>
    <div class="comment-box">
      <div class="comment-head">
          <h6 class="comment-name by-author"><a href="#" class="author">{{this.author}}</a></h6>
          <span class="time"></span>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <form action="/deleteIssueComment/{{../num}}/{{../fullName}}/{{this.id}}" method="POST" id="{{this.id}}">
            <span class="clicky" style="font-size: 20px" onclick="document.getElementById({{this.id}}).submit(); return false;" aria-hidden="true">&times;
            </span>
            <input type="hidden" class="csurf" name="_csrf" value="{{../csrfToken}}">
            </form>
          </button>
      </div>
      <div class="comment-content">
        {{this.body}}
    </div>
  </div>
</div>
`

li.innerHTML = `
<div class="comment-main-level">
  <!-- Avatar -->
  <div class="comment-avatar"><img class="pic" src="{{this.img}}" alt=""/></div>
  <div class="comment-box">
      <div class="comment-head">
          <h6 class="comment-name"><a href="#" class="author">{{this.author}}</a></h6>
          <span class="time"></span>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <form action="/deleteIssueComment/{{../num}}/{{../fullName}}/{{this.id}}" method="POST" id="{{this.id}}">
            <span class="clicky" style="font-size: 20px" onclick="document.getElementById({{this.id}}).submit(); return false;" aria-hidden="true">&times;</span>
            <input type="hidden" class="csurf" name="_csrf" value="{{../csrfToken}}">
            </form>
          </button>
      </div>
      <div class="comment-content">
          {{this.body}}
      </div>
  </div>
</div>
`

socket.on('issue_comment', function (data) {
  if (data.token) {
    token = data.token
  }
  let comment
  if (data.issue.user.login === data.sender.login) {
    comment = liAuthor.cloneNode(true)
  } else {
    comment = li.cloneNode(true)
  }

  if (data.action === 'created') {
    counter++

    displayComment(comment, data)

    comment.style.order = counter * -1
    ul.append(comment)
  } else if (data.action === 'deleted') {
    counter--

    const elements = document.getElementsByClassName('child')
    const number = data.comment.id
    const node = getElement(elements, number)
    if (node) {
      node.remove()
    }
  } else if (data.action === 'edited') {
    counter++
    const elements = document.getElementsByClassName('child')
    const number = data.comment.id
    const node = getElement(elements, number)
    if (node) {
      node.remove()
    }
    displayComment(comment, data)
    comment.style.order = counter * -1
    ul.append(comment)
  }
})

socket.on('issues', function (data) {
  if (data.token) {
    token = data.token
  }
})

function getElement (elements, number) {
  let node
  for (const item of elements) {
    let num = item.getAttribute('data-comment')
    num = parseInt(num, 10)
    if (num === number) {
      node = item
      break
    }
  }
  return node
}

function displayComment (comment, data) {
  comment.setAttribute('data-comment', data.comment.id)
  const img = comment.querySelector('.pic')
  const user = comment.querySelector('.author')
  const content = comment.querySelector('.comment-content')
  const time = comment.querySelector('.time')
  const remove = comment.querySelector('.clicky')
  const form = comment.querySelector('form')
  const csurf = form.querySelector('.csurf')
  csurf.setAttribute('value', token)
  form.setAttribute('id', data.comment.id)
  form.setAttribute('action', `/deleteIssueComment/${data.issue.number}/${data.repository.full_name}/${data.comment.id}`)
  remove.setAttribute('onclick', `document.getElementById(${data.comment.id}).submit(); return false;`)
  time.textContent = data.comment.updated_at

  img.setAttribute('src', data.sender.avatar_url)
  user.textContent = `${data.sender.login}`
  content.textContent = `${data.comment.body}`
}
