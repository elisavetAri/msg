import { User } from '/imports/api/user/user.js';

var Api = new Restivus({
  useDefaultAuth: false,
  prettyJson: false,
  enableCors : true
});

Api.addRoute('test', {
  get : function(req, res){
    var name = this.bodyParams.name;
    var name1 = User.findOne({name:name});
    var userId = this.queryParams.userId;
    return {status : "OK", name: this.queryParams.name};
  }
});
