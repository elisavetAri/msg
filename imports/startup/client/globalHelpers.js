Template.registerHelper("parseDate", function(timestamp) {
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
});
Template.registerHelper("isMe", function(id) {
  return Session.get('u_l') == id;
});
