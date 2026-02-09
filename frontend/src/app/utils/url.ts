export class urlconstants {
    static serveapi =  "https://todo-list-cp7j.onrender.com/api"
    
    static createaccount = this.serveapi + "/signup";
    static login = this.serveapi + "/login";
    
    static createtask = this.serveapi + "/createtask";
    static gettasks = this.serveapi + "/gettasks";
    static getrecenttasks = this.serveapi + "/gettasks/recent";
    static gettaskbyid = this.serveapi + "/task";
    static getpublictaskbyid = this.serveapi + "/task/public";
    static updatetask = this.serveapi + "/updatetask";
    static deletetask = this.serveapi + "/deletetask";
    static reordertasks = this.serveapi + "/reorder/all";
    static taskdayscount = this.serveapi + "/taskdayscount";
    static sendmail = this.serveapi + "/mail/send-mail";
    static taskvisibility = this.serveapi + "/task/visibility";
}