const userDetails = document.querySelector('.userDetails')
const editProfile = document.querySelector('#editProfile')
function createUserCollection(user){
    firebase.firestore().collection('users')
    .doc(user.uid)
    .set({
        uid:user.uid,
        name:user.displayName,
        email:user.email,
        phone:"",
        specialty:"",
        portfolioUrl:"",
        experience:""

    })
}


async function getuserInfo(userID){
    if(userID){const userInfosnap  = await firebase.firestore()
    .collection('users')
    .doc(userID)
    .get()

    const userInfo = userInfosnap.data()
    if(userInfo){
        userDetails.innerHTML = `
        <h3>${userInfo.name}</h3>
        <h3>${userInfo.email}</h3>
        <h3>${userInfo.phone}</h3>`
    }
     }else{
        userDetails.innerHTML = `
        <h3>Please Login</h3>
        `
    }
}

// Lay Info cua user show ra man hinh
async function getuserInfoRealtime(userID){
    if(userID){
        // doan nay lay thong tin: userID duoc gan cho bang uid o ben fs.rules, neu dung userID thi lay thong tin cua user do ra
    const userdocRef  = await firebase.firestore()
    .collection('users')
    .doc(userID)
    userdocRef.onSnapshot((doc) =>{
        if(doc.exists){
            const userInfo = doc.data()
            if(userInfo){
                // doan nay in thong tin ra nay
                userDetails.innerHTML = `

                <ul class="collection">
                    <li class="collection-item"><h3>${userInfo.name}</h3></li>
                    <li class="collection-item">${userInfo.email}</li>
                    <li class="collection-item">phone - ${userInfo.phone}</li>
                    <li class="collection-item">specialty - ${userInfo.specialty}</li>
                    <li class="collection-item">experience - ${userInfo.experience}</li>
                    <li class="collection-item">portfolioURL - <a href = "${userInfo.portfolioUrl}">Open</li>
                </ul>
                <button class="btn waves-effect #fbc02d yellow darken-2 modal-trigger" href="#modal3">editProfile</button>   
                `
                // duoi kia update thi tren nay duoc update, doan nay gan gia tri duoi kia vao tren nay (Realtime)
                editProfile["name"].value = userInfo.name
                editProfile["profileEmail"].value = userInfo.email
                editProfile["phoneno"].value = userInfo.phone
                editProfile["specialty"].value = userInfo.specialty
                editProfile["prorfolioUrl"].value = userInfo.portfolioUrl
                editProfile["experience"].value = userInfo.experience



                if(firebase.auth().currentUser.photoURL){
                    document.querySelector("#proimg").src = firebase.auth().currentUser.photoURL
                }
            }
        }
    })   
    }else{
        userDetails.innerHTML = `
        <h3>Please Login</h3>
        `
    }
}

// cai function duoi kia day =)) 
function updateUserProfile(e){
    e.preventDefault()
    // tao bien duoi(userDocref), cho no truy cap vao fs va cai thong tin dk trong auth o fb
    const userDocRef = firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
// doan nay update
    userDocRef.update({
        name:editProfile["name"].value,
        email:editProfile["profileEmail"].value,
        phone:editProfile["phoneno"].value,
        specialty:editProfile["specialty"].value,
        portfolioUrl:editProfile["prorfolioUrl"].value,
        experience:editProfile["experience"].value
    })
    M.Modal.getInstance(Mymodel[2]).close()
}


function uploadImage(e){
   console.log(e.target.files[0])  
     const uid = firebase.auth().currentUser.uid
     const fileRef = firebase.storage().ref().child(`/users/${uid}/profile`)
     const uploadTask = fileRef.put(e.target.files[0])
     uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    if(progress=='100') alert('Uploaded')
  }, 
  (error) => {
    console.log(error)
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    uploadTask.snapshot.ref.getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      firebase.auth().currentUser.updateProfile({
        photoURL:downloadURL
      })
         });    
        }
    );
}

function allUserDetails(){
    document.getElementById('table').style.display = 'table'
    const userRef = firebase.firestore().collection('users')

    userRef.onSnapshot(querysnap =>{
        querysnap.docs.forEach(doc =>{
            const info = doc.data()
            document.getElementById('tbody').innerHTML +=`
                <tr>
                    <td>${info.name}</td>
                    <td>${info.email}</td>
                    <td>${info.phone}</td>
                    <td>${info.specialty}</td>
                    <td>${info.experience}</td>
                    <td> <a href="${info.experience}">view</td>
                </tr>
            `
        })
    })
}