function showModal(c,t,f,fun){
  if(!t)
    t='提示';
  wx.showModal({
    title: t,
    content: c,
    showCancel:f,
    success:fun
  })
}


module.exports.showModal=showModal;