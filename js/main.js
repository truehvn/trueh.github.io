window.addEventListener('DOMContentLoaded', function(e) {

  var init = function(){
    var showList = function(what){
      TH.Data.clearList();
      TH.Data.getLatest(undefined, function(){
        TH.Data.loadMore();
      });

      document.body.classList.remove(TH.UI.CLASS_NAME.SEARCH);
      document.body.classList.remove(TH.UI.CLASS_NAME.DETAIL);
      document.body.classList.add(TH.UI.CLASS_NAME.LIST);
    }

    var hideMain = function(){
      var sections = document.body.querySelectorAll("main>section");
      var i;
      for (i = 0; i < list.length; i++) {
        sections[i].style.display = 'none';
      }
    }

    var showDetail = function(what){
      var callback = function(data){
        if(typeof(data) !== 'object'){
          data = TH.Parser.toJSON(data);
        }

        var html = TH.UI.genDetail(data);
        var elemSectionContent = document.querySelector("section#main-detail");
        elemSectionContent.setAttribute('class', data['content_type']);
        elemSectionContent.innerHTML = html;
      }

      TH.Data.getDetail(what, callback);

      document.body.classList.remove(TH.UI.CLASS_NAME.LIST);
      document.body.classList.remove(TH.UI.CLASS_NAME.SEARCH);
      document.body.classList.add(TH.UI.CLASS_NAME.DETAIL);
      document.querySelector("section#main-detail").innerHTML = '';
    };

    var search = function(what){
      document.body.classList.remove(TH.UI.CLASS_NAME.LIST);
      document.body.classList.remove(TH.UI.CLASS_NAME.DETAIL);
      document.body.classList.add(TH.UI.CLASS_NAME.SEARCH);

      TH.Data.clearList();
      TH.Data.search(what);
    }

    // config Router
    TH.Router.config({
      root: '/',
      MODE: {
        LIST: 'list',
        SEARCH: 'search',
        DETAIL: 'view'
      }
    });

    TH.Router.add(/^\s+$/, function(){
      console.log("I'm in HOME");
      showList();
    });
    TH.Router.add(/^\/$/, function(){
      console.log("I'm in LIST");
      showList();
    });
    TH.Router.add(/^\s*$/, function(){
      console.log("I'm in HOME");
      showList();
    });
    TH.Router.add(/^\/list$/, function(){
      console.log("I'm in LIST");
      showList();
    });
    TH.Router.add(/^\/search\/(.*)/, function(what){
      console.log("I'm in SEARCH: " + what);
      console.log(arguments);
      search(what);
    });
    TH.Router.add(/^\/view\/(.*):(.*)/, function(what, tag){
      console.log("I'm in VIEW: " + what + "=>" + tag);
      console.log(arguments);
      showDetail(what, tag);
    });
    TH.Router.add(/^\/view\/(.*)/, function(what){
      console.log("I'm in VIEW: " + what);
      console.log(arguments);
      showDetail(what);
    });

    TH.Router.registEvent();
  };

  // config and load language
  TH.Network.get('./../config/config.json')
    .then(function(responseStr) {
      // update configuration
      TH.config(responseStr);
      
      // load language
      TH.Lang.load();

      // init Waterfall
      TH.UI.setWaterfall('.wf-container', new Waterfall({ minBoxWidth: 320 }) );

      init();
    }, function(error) {
      TH.Debug.debug(TH.Debug.MODE.ERROR, error);
    });

  // check touch device
  if(TH.Utils.hasTouchSupport()){
    document.body.classList.add(TH.UI.CLASS_NAME.TOUCH);
  }

  // define elements whats has action on
  var mEleBtnHome = document.getElementById("btn-home");
  var mEleBtnBack = document.getElementById("btn-back");
  var mEleLblTitle = document.querySelector("[data-detail=title]");
  var mEleBtnSearch = document.getElementById("btn-search");
  var mEleSearchInput = document.getElementById("search-input");
  var mEleBtnTags = document.getElementById("btn-tags");

  // add event listener
  mEleBtnHome.addEventListener("click",function(e){
    document.body.classList.remove(TH.UI.CLASS_NAME.SEARCH);
    document.body.classList.remove(TH.UI.CLASS_NAME.DETAIL);
    document.body.classList.add(TH.UI.CLASS_NAME.LIST);
    mEleLblTitle.innerText = '';
    window.location.hash = '';
  },false);

  mEleBtnBack.addEventListener("click", function(e){
    if(document.body.classList.contains(TH.UI.CLASS_NAME.SEARCH)){
      setTimeout(function(){
        TH.Data.clearList();
        TH.Data.getLatest(undefined, function(){
          TH.Data.loadMore();
        });
      }, 500);
    }
    document.body.classList.remove(TH.UI.CLASS_NAME.DETAIL);
    document.body.classList.remove(TH.UI.CLASS_NAME.SEARCH);
    document.body.classList.add(TH.UI.CLASS_NAME.LIST);
    mEleLblTitle.innerText = '';
    window.location.hash = '';
  },false);

  mEleBtnTags.addEventListener("click", function(e){
    var elemMainMore = document.getElementById("main-more");
    elemMainMore.classList.toggle('active');
  },false);

  mEleSearchInput.addEventListener("search", function(e){
    if(this.value == ''){
      return;
    }
    this.blur();

    setTimeout(function(){
      window.location.hash = TH.Router.genUIRoute(TH.Router.MODE.SEARCH, TH.Utils.spaceToUnderline(mEleSearchInput.value));
    }, 500);
    
  },false);

  
  var eleHeader = document.querySelector('header');
  var eleMainDetail = document.querySelector("section#main-detail");
  var height = window.innerHeight - eleHeader.offsetHeight;
  eleMainDetail.style.height = height + 'px';

});