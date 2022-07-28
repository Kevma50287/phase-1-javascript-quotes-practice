////////////////////////// NOTE: Added defer ///////////////////////////////

const quoteURL = 'http://localhost:3000/quotes'
const likeURL = 'http://localhost:3000/likes'
const QuoteEmbedURL = 'http://localhost:3000/quotes?_embed=likes'
const quoteUL = document.getElementById('quote-list')
const NewQuoteForm = document.getElementById('new-quote-form')

fetch(QuoteEmbedURL)
.then(res=>res.json())
.then(data=>{
    console.log(data)
    data.forEach(element => {
        renderQuote(element)
    });
})

const renderQuote = (element) => {
    let li = document.createElement('li')
    li.classList.add('quote-card')
    li.setAttribute('label-id', element.id)
    
    let blockquote = document.createElement('blockquote')
    blockquote.classList.add ('blockquote')

    let p = document.createElement('p')
    p.textContent = element.quote
    p.classList.add(`mb-0`)

    let footer = document.createElement('footer')
    footer.classList.add('blockquote-footer')
    footer.textContent = element.author

    let br = document.createElement('br')
    let span = document.createElement('span')
    if (element.likes){
        span.textContent = element.likes.length
    } else {span.textContent = 0}

    let likebtn = document.createElement('button')
    likebtn.classList.add('btn-success')
    likebtn.textContent = 'Likes: '
    likebtn.addEventListener('click', (e) => uplike(e))

    let delbtn = document.createElement('button')
    delbtn.classList.add('btn-danger')
    delbtn.textContent = 'Delete'
    delbtn.addEventListener('click', (e) => deletion(e))

    //////////////////////////////// EDIT BUTTON /////////////////////////////
    let editbtn = document.createElement('button')
    editbtn.textContent = 'Edit'
    editbtn.addEventListener('click', (e) => showEdit(e))

    let editinput = document.createElement('textarea')
    editinput.name = 'newEdit'
    editinput.id = 'newEdit'
    editinput.rows = 5
    editinput.cols = 30
    editinput.textContent = element.quote

    let editform = document.createElement('form')
    editform.id = 'NewEdit'
    editform.style.display = 'none'
    editform.addEventListener('submit', (e) => {
        e.preventDefault()
        editQuoteFunc(e)
    })

    let editSubmitbtn = document.createElement('button')
    editSubmitbtn.type = 'submit'
    editSubmitbtn.textContent = 'Submit Edit'
    editSubmitbtn.classList.add('btn', 'btn-primary')
    editSubmitbtn.style.position = 'relative'
    editSubmitbtn.style.bottom = '130px'
    //////////////////////////////////////////////////////////////////////////

    //append everything
    editform.append(editinput, editSubmitbtn)
    likebtn.append(span)
    blockquote.append(p, footer, br, likebtn, delbtn, editbtn, editform)
    li.append(blockquote)
    quoteUL.append(li)
}

NewQuoteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    AddQuote()
    NewQuoteForm.reset()
})

//posts a new quote to API, generates it on page
const AddQuote = () => {
    let postObj = {
        method:'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            quote:NewQuoteForm.quote.value,
            author:NewQuoteForm.author.value
        })
    }

    fetch(quoteURL, postObj)
    .then(res=>res.json())
    .then(data=>renderQuote(data))
}

//deletes entry, delete in API
const deletion = (e) => {
    let targetlabel = e.target.parentNode.parentNode
    let labelid = targetlabel.getAttribute('label-id')
    fetch(`${quoteURL}/${labelid}`,{method:'DELETE'})
    .then(res=>res.json())
    .then(data=> {
        targetlabel.remove()
    }).catch(err=>alert(err))
}

//like function, post to API, then edits the DOM
const uplike = (e) => {
    let targetlabel = e.target.parentNode.parentNode
    let labelid = targetlabel.getAttribute('label-id')
    let postObj = {
        method:'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            quoteId: parseInt(labelid),
            createdAt: Date.now()
        })
    }

    let targetspan = e.target.querySelector('span')
    let targetLikeCt = parseInt(targetspan.textContent)

    fetch(likeURL, postObj)
    .then(res=>res.json())
    .then(data=>{
        targetLikeCt ++
        targetspan.textContent = targetLikeCt
    }).catch(err=>alert(err))
}

//shows the Edit Form
const showEdit = (e) => {
    let targetform = e.target.parentNode.querySelector('form')
    if (targetform.style.display==='none'){
        targetform.style.display='block'
    } else (targetform.style.display='none')
}

//edits the quote, patches API
const editQuoteFunc = (e) => {
    let targetLI = e.target.parentNode.parentNode
    let targetID = targetLI.getAttribute('label-id')
    let patchObj = {
        method:'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            quote:e.target.newEdit.value
        })
    }
    fetch(`${quoteURL}/${targetID}`, patchObj)
    .then(res=>res.json())
    .then(data => {
        e.target.parentNode.firstChild.textContent = data.quote
    }).catch(err=>alert(err))
}