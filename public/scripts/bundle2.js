!function(e){var t={};function n(o){if(t[o])return t[o].exports;var s=t[o]={i:o,l:!1,exports:{}};return e[o].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(o,s,function(t){return e[t]}.bind(null,s));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";const o=window.io(),s=document.createElement("div"),r=document.getElementById("container");let i,a=0;function d(e,t){let n;for(const o of e){let e=o.getAttribute("data-issue");if(e=parseInt(e,10),e===t){n=o;break}}return n}function l(e,t,n,o,s,r,d,l,c,u,p,m){t.textContent=`${e.issue.title}`,u.textContent=`${e.issue.user.login}`,n.textContent=`${e.repository.html_url}`,o.textContent=` ${e.issue.created_at}`,s.textContent=` ${e.issue.updated_at}`,r.textContent=`${e.issue.body}`,d.textContent=` ${e.issue.comments}`,m.querySelector(".csurf").setAttribute("value",i),m.setAttribute("id",e.issue.id),m.setAttribute("action",`/closeIssue/${e.issue.number}/${e.repository.full_name}`),e.organization?p.setAttribute("href",`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.issue.number}/${e.repository.name}/comments`):p.setAttribute("href",`/${e.sender.login}/repo/issues/${e.issue.number}/${e.repository.name}/comments`),l.append(c),c.style.order=-1*a}s.className="child",s.innerHTML='\n  <div class="card" style="width: 32rem;">\n  <div class="card-body">\n    <h5 class="card-title">{{this.title}}</h5>\n    <h6 class="card-subtitle mb-2 text-muted">{{this.user}}</h6>\n    <p class="card-text text">{{this.body}}</p>\n    <a class="lol2 url" href="{{this.url}}">{{this.url}}</a>\n    <p class="two"><span class="font-weight-bold"> Comments:</span></p><p class="comments two"></p>\n    <a href="/{{../navBar.username}}/repo/{{../org}}/issues/{{this.number}}/{{../repo}}/comments" class="show"><p class="one lol">Show.</p></a> \n    <br>\n    <p class="two"><span class="font-weight-bold">Created at:</span></p><p class="created two"></p>\n    <br>\n    <p class="two"><span class="font-weight-bold">Last Updated:</span></p><p class="updated two"></p>\n    <br>\n    <form action="/closeIssue" method="POST">\n      <a href="#"><p onclick="document.getElementById({{this.id}}).submit(); return false;" class="text-danger">Close issue</p> \n      </a>\n    <input type="hidden" class="csurf" name="_csrf" value="{{../csrfToken}}">\n    </form>\n  </div>\n</div>\n',o.on("issues",(function(e){e.token&&(i=e.token),a++;const t=s.cloneNode(!0);t.setAttribute("data-issue",e.issue.id);const n=t.querySelector(".card-title"),o=t.querySelector(".card-text"),c=t.querySelector(".card-subtitle"),u=t.querySelector(".url"),p=t.querySelector(".created"),m=t.querySelector(".updated"),y=t.querySelector(".comments"),g=t.querySelector(".show"),b=t.querySelector("form");if(b.querySelector("p").setAttribute("onclick",`document.getElementById(${e.issue.id}).submit(); return false;`),"edited"===e.action){const s=e.issue.id;d(document.getElementsByClassName("child"),s).remove(),a--,l(e,n,u,p,m,o,y,r,t,c,g,b)}else if("closed"===e.action){const t=e.issue.id;d(document.getElementsByClassName("child"),t).remove(),a--}else"reopened"===e.action?l(e,n,u,p,m,o,y,r,t,c,g,b):"opened"===e.action&&l(e,n,u,p,m,o,y,r,t,c,g,b)}))},function(e,t,n){"use strict";function o(e,t,n,o){const s=e,r={body:t,data:{prop1:123,prop2:"Steve"},lang:"en-CA",icon:n,timestamp:Date.now()+12e4,vibrate:[100,200,100]},i=new window.Notification(s,r);i.addEventListener("click",(function(e){console.log("clicked"),window.focus(),window.open(o,"_self"),i.close(),m()})),setTimeout(i.close.bind(i),1e4)}n.r(t),"Notification"in window&&("granted"===window.Notification.permission||window.Notification.requestPermission().then((function(e){console.log(e),window.Notification.permission})).catch(e=>{console.log(e)}));const s=window.io();let r=window.sessionStorage.getItem("theIssuerNotis");const i=document.getElementById("notis"),a=document.getElementById("notisBar"),d=document.createElement("div");d.innerHTML='\n<div role="alert" aria-live="assertive" aria-atomic="true" class="toast show" data-autohide="false">\n<div class="toast-header">\n  <img src="..." class="rounded mr-2 img" alt="...">\n  <strong class="mr-auto headings">Bootstrap</strong>\n  <small id="time"> less than 1 min ago</small>\n  <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">\n  <span aria-hidden="true" class="del" >&times;</span>\n</button>\n</div>\n<a href="#">\n  <div class="toast-body"></div>\n</a>\n</div>\n';let l=0,c=0;var u;function p(e){let t=e.target.getAttribute("data-id");const n=document.getElementById(t);t=parseInt(t,10),m(t),n.remove()}function m(e){r=window.sessionStorage.getItem("theIssuerNotis"),r=JSON.parse(r),r=r.filter(t=>t.id!==e),r=JSON.stringify(r),window.sessionStorage.setItem("theIssuerNotis",r),l--,i.textContent=0===l?"":l}r&&(r=JSON.parse(r),r.length>0&&(l=(u=r).length,u.forEach(e=>{const t=d.cloneNode(!0);t.className+=" space";const n=t.querySelector(".toast-body"),o=t.querySelector(".headings"),s=t.querySelector(".img"),r=t.querySelector(".del"),c=document.createElement("span"),u=document.createElement("label");t.setAttribute("id",e.id),c.className="font-weight-bold";const m=c.cloneNode(!0);t.querySelector("a").setAttribute("href",e.url),i.textContent=0===l?"":l,"edited"===e.type?"issue"===e.notisType?(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),c.textContent=`${e.author} `,n.append(c),u.textContent=" edited an issue name on ",n.append(u),m.textContent=` ${e.repo}`,n.append(m),o.textContent="Issue edited"):(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),c.textContent=`${e.author} `,n.append(c),u.textContent=" edited a comment on ",n.append(u),m.textContent=` ${e.repo}`,n.append(m),o.textContent="Comment edited"):"created"===e.type?(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),c.textContent=`${e.author} `,n.append(c),u.textContent=" created a new comment on ",n.append(u),m.textContent=` ${e.repo}`,n.append(m),o.textContent="New Comment"):"deleted"===e.type?(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),c.textContent=`${e.author} `,n.append(c),u.textContent=" deleted a comment on ",n.append(u),m.textContent=` ${e.repo}`,n.append(m),o.textContent="Comment deleted"):"reopened"===e.type?(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),c.textContent=`${e.author} `,n.append(c),u.textContent=" reopened an issue on ",n.append(u),m.textContent=` ${e.repo}`,n.append(m),o.textContent="Issue reopened"):"opened"===e.type?(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),c.textContent=`${e.author} `,n.append(c),u.textContent=" created a new issue on ",n.append(u),m.textContent=` ${e.repo}`,n.append(m),o.textContent="New issue"):"closed"===e.type&&(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),c.textContent=`${e.author} `,n.append(c),u.textContent=" closed an issue on ",n.append(u),m.textContent=` ${e.repo}`,n.append(m),o.textContent="Issue closed"),window.$(r).click(p),a.append(t)}))),s.on("issue_comment",e=>{r=window.sessionStorage.getItem("theIssuerNotis"),r=r?JSON.parse(r):[];const t={};l++,c++;const n=d.cloneNode(!0);n.className+=" space",n.setAttribute("id",c);const s=n.querySelector(".toast-body"),u=n.querySelector(".headings"),m=document.createElement("span"),y=n.querySelector("a");let g;n.style.order=-1*l,y.setAttribute("data-id",c),e.organization?(g=`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.issue.number}/${e.repository.name}/comments`,y.setAttribute("href",`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.issue.number}/${e.repository.name}/comments`)):(g=`/${e.sender.login}/repo/issues/${e.issue.number}/${e.repository.name}/comments`,y.setAttribute("href",`/${e.sender.login}/repo/issues/${e.issue.number}/${e.repository.name}/comments`));const b=document.createElement("label");m.className="font-weight-bold";const f=m.cloneNode(!0),C=n.querySelector(".img"),x=n.querySelector(".del");x.setAttribute("data-id",c),C.setAttribute("src",e.sender.avatar_url),i.textContent=l,"deleted"===e.action?(m.textContent=`${e.sender.login} `,s.append(m),b.textContent=" deleted a comment on ",s.append(b),f.textContent=` ${e.repository.full_name}`,s.append(f),u.textContent="Comment Deleted"):"edited"===e.action?(m.textContent=`${e.sender.login} `,s.append(m),b.textContent=" edited an issue comment on ",s.append(b),f.textContent=` ${e.repository.full_name}`,s.append(f),u.textContent="Comment Edited"):"created"===e.action&&(m.textContent=`${e.sender.login} `,s.append(m),b.textContent=" created a new comment on ",s.append(b),f.textContent=` ${e.repository.full_name}`,s.append(f),u.textContent="New Comment"),t.type=e.action,t.author=e.sender.login,t.heading=u.textContent,t.body=b.textContent,t.img=e.sender.avatar_url,t.repo=e.repository.full_name,t.id=c,t.url=g,document.hidden&&o(u.textContent,`${m.textContent}${b.textContent}${f.textContent}`,e.sender.avatar_url,g),window.$(x).click(p),window.$(y).click(p),a.append(n),r.push(t),r=JSON.stringify(r),window.sessionStorage.setItem("theIssuerNotis",r)}),s.on("issues",(function(e){r=window.sessionStorage.getItem("theIssuerNotis"),r=JSON.parse(r);const t={};l++,c++;const n=d.cloneNode(!0);n.className+=" space";const s=n.querySelector(".toast-body"),u=n.querySelector(".headings"),m=n.querySelector(".img"),y=n.querySelector(".del"),g=n.querySelector("a");let b;n.style.order=-1*l,g.setAttribute("data-id",c),e.organization?(b=`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.repository.name}/`,g.setAttribute("href",`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.repository.name}/`)):(b=`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.repository.name}`,g.setAttribute("href",`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.repository.name}`));const f=document.createElement("span"),C=document.createElement("label");f.className="font-weight-bold";const x=f.cloneNode(!0);y.setAttribute("data-id",c),m.setAttribute("src",e.sender.avatar_url),i.textContent=l,"edited"===e.action?(f.textContent=`${e.sender.login} `,s.append(f),C.textContent=" edited an issue name on ",s.append(C),x.textContent=` ${e.repository.full_name}`,s.append(x),u.textContent="Issue edited"):"closed"===e.action?(f.textContent=`${e.sender.login} `,s.append(f),C.textContent=" closed an issue on ",s.append(C),x.textContent=` ${e.repository.full_name}`,s.append(x),u.textContent="Issue closed"):"reopened"===e.action?(f.textContent=`${e.sender.login} `,s.append(f),C.textContent=" reopened an issue on ",s.append(C),x.textContent=` ${e.repository.full_name}`,s.append(x),u.textContent="Issue reopened"):"opened"===e.action&&(f.textContent=`${e.sender.login} `,s.append(f),C.textContent=" created a new issue on ",s.append(C),x.textContent=` ${e.repository.full_name}`,s.append(x),u.textContent="New issue"),t.type=e.action,t.author=e.sender.login,t.heading=u.textContent,t.body=C.textContent,t.img=e.sender.avatar_url,t.id=c,t.repo=e.repository.full_name,t.notisType="issue",t.url=b,r.push(t),r=JSON.stringify(r),window.sessionStorage.setItem("theIssuerNotis",r),window.$(y).click(p),window.$(g).click(p),a.append(n),document.hidden&&o(u.textContent,`${f.textContent}${C.textContent}${x.textContent}`,e.sender.avatar_url,b)})),window.addEventListener("beforeunload",(function(e){s.disconnect()}));n(0)}]);