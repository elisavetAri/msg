import '../../ui/layout/body/body.js';

import '../../ui/pages/main/main.js';
import '../../ui/pages/page2/page2.js';
import '../../ui/pages/messenger/messenger.js';
import '../../ui/pages/forgotPassword/password.js';
import '../../ui/pages/this/this.js';

FlowRouter.route('/', {
  action : function(){
    BlazeLayout.render('App_Body', { Body: 'App_Main' });
  }
});
FlowRouter.route('/page2', {
  action : function(){
    BlazeLayout.render('App_Body', { Body: 'App_page2' });
  }
});
FlowRouter.route('/messenger', {
  action : function(){
    BlazeLayout.render('App_Body', { Body: 'App_messenger' });
  }
});
FlowRouter.route('/password', {
  action : function(){
    BlazeLayout.render('App_Body', { Body: 'App_password' });
  }
});
FlowRouter.route('/video', {
  action : function(){
    BlazeLayout.render('App_Body', { Body: 'App_video' });
  }
});
