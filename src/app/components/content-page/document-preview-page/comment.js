const form = $("#comment-form")
const commentList = $(".collection")
const commentInput = $("#comment_area")
loadEventListeners();

function loadEventListeners() {
    document.addEventListener('DOMContentLoaded', getComment); // เมื่อ HTML load จะเรียก Fucntion getComment
    form.addEventListener('submit', addComment); // จะใช้เป็น event click ที่ button โดยตรงเลยก็ได้ document.getElementById("commentBtn").addEventListener("click", addComment);
}

// แสดงค่าที่อยู่ใน Localstorage
function getComment() {
    let listOfComment;
    if (localStorage.getItem('listOfComment') === null) {
        listOfComment = [];
    } else {
        listOfComment = JSON.parse(localStorage.getItem('listOfComment'));
    }

    listOfComment.forEach(function(commentVal) {
        const li = document.createElement('li');
        li.className = 'collection-item';
        // สร้าง text node และเอาเข้าไปใน tag li
        li.appendChild(document.createTextNode(commentVal));
        // เอา tag li ทั้งหมดเข้าไปใน ul
        commentList.appendChild(li);
        console.log(commentVal)
    });
}


function addComment(e) {
    if (commentInput.value === '') {
        alert('Add a comment');
        return false;
    }

    const li = document.createElement('li'); //build element <li></li>
    li.className = 'collection-item'; //build class collection-item
    // สร้าง text node และเอาเข้าไปใน tag li
    li.appendChild(document.createTextNode(commentInput.value)); //เอาค่าทีป้อนเข้าไปในli
    // เอา tag li ทั้งหมดเข้าไปใน ul
    commentList.appendChild(li);
    // ส่ง Value
    storeTaskInLocalStorage(commentInput.value); //เก็บค่าอินพุทเข้า

}

// เก็บ Value เข้า Localstorage
function storeTaskInLocalStorage(comment) {
    let listOfComment;
    if (localStorage.getItem('listOfComment') === null) {
        listOfComment = [];
    } else {
        listOfComment = JSON.parse(localStorage.getItem('listOfComment')); //ดึงค่าในloacalออกมา
    }
    // เก็บ Value เข้า JSON
    listOfComment.push(comment);
    localStorage.setItem('listOfComment', JSON.stringify(listOfComment));
}