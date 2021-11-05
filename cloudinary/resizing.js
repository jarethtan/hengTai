module.exports.showImageTransform = function (n) {
for (let i=0;i<n.length;i++){
    let reg = new RegExp('[/]')
    const filename = n[i].filename.replace(reg, ':')
    n[i].url = n[i].url.replace('/upload', `/upload/c_fill,e_blur:1500,h_530,o_75,w_830/c_limit,co_rgb:5e5e5e,e_outline:outer:1:100,fl_no_overflow,h_530,w_830,l_${filename}`)
} return n
} 

module.exports.homeImageTransform = function (n) {
        n.image.url = n.image.url.replace('/upload','/upload/c_scale,e_redeye,h_750,q_100,w_1000')
}

