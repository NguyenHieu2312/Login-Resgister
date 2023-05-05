const Mymodel = document.querySelectorAll('.modal')

async function signup(e){
    e.preventDefault()
    // const username = document.querySelector('#signupUser')
    const email = document.querySelector('#signupEmail')
    const password = document.querySelector('#signupPassword')
    try{
        const result = await firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        await result.user.updateProfile({
            displayName: "User"
        })
        createUserCollection(result.user)
        // await result.user.sendEmailVerification()
        M.toast({html: `Welcome ${result.user.email}`, classes:"green"})
        console.log(result)
    }catch(err){
        console.log(err)
        M.toast({html: err.message, classes:"red"})
    }
    email.value = ""
    password.value = ""
    M.Modal.getInstance(Mymodel[0]).close()
}



async function login(e){
    e.preventDefault()
    // const username = document.querySelector('#signupUser')
    const email = document.querySelector('#loginEmail')
    const password = document.querySelector('#loginPassword')
    try{
        const result = await firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        M.toast({html: `Welcome ${result.user.email}`, classes:"green"})
        // window.location.assign('page.html')
        console.log(result)
    }catch(err){
        console.log(err)
        M.toast({html: err.message, classes:"red"})
    }
    // dong modal login va clear input
    email.value = ""
    password.value = ""
    M.Modal.getInstance(Mymodel[1]).close()
}




function logout(){
    firebase.auth().signOut()
}

const unsub = firebase.auth().onAuthStateChanged((user) => {
    if(user){
        console.log(user)
        // getuserInfo(user.uid)
        getuserInfoRealtime(user.uid)
    }else{
        getuserInfoRealtime(null)
        console.log('signout success')
        M.toast({html: 'Signout successful', classes:"green"})
    }
});

//  function logout2(){
//     firebase.auth().signOut()
// }
// const outta = firebase.auth().onAuthStateChanged((user) => {
//     if(user){
//         console.log(user)
//         // getuserInfo(user.uid)
//         getuserInfoRealtime(user.uid)
//     }else{
//         getuserInfoRealtime(null)
//         window.location.assign('index.html')
//         console.log('signout success')
//         M.toast({html: 'Signout successful', classes:"green"})
//     }
// });


//async function loginWithGoogle(){
    //     try{
    //         var provider = new firebase.auth.GoogleAuthProvider();
    //         await firebase.auth()
    //         .signInWithPopup(provider)
    //         console.log(result)
    //     }catch(err){
    //         console.log(err)
    //     }
    // }
