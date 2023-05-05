
async function logout2(){
    firebase.auth().signOut()
}
const outta = await firebase.auth().onAuthStateChanged((user) => {
    if(user){
        console.log(user)
        // getuserInfo(user.uid)
        getuserInfoRealtime(user.uid)
    }else{
        getuserInfoRealtime(null)
        window.location.assign('index.html')
        console.log('signout success')
        M.toast({html: 'Signout successful', classes:"green"})
    }
});