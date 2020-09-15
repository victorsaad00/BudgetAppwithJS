var budgetController = (function() {

  var Expense = function(id, descritpion, value){
    this.id = id;
    this.description = descritpion;
    this.value = value;
  }

  var Income = function(id, descritpion, value){
    this.id = id;
    this.description = descritpion;
    this.value = value;
  }

  var data = {
    allItems: {
      exp:[],
      inc:[]
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // Create new ID 
      if (data.allItems[type].length > 0)
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      else
        ID = 0;
      
      //Create new ITEM based on inc or exp type
      if(type === 'exp'){
        // expense
        newItem = new Expense(ID, des, val);
      } else if(type === 'inc') {
        //income
        newItem = new Income(ID, des, val);
      }

      // Push it our data structure
      data.allItems[type].push(newItem); // add new item a the end of the array.
      return newItem; // Return element for later usage.
    },

    testing: function(){
      console.log(data);
    }
  }

}());

// UI CONTROLLER
var UIcontroller = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription:'.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
  }

  return {
      getInput: function(){
        return {
            type: document.querySelector(DOMstrings.inputType).value, // + (inc ) or - (exp)
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
          };
      }, 

      getDOMstrings: function(){
        return DOMstrings;
      }
  }
}());

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function(){
    var DOM = UICtrl.getDOMstrings();
    
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13){
          //console.log('ENTER WAS PRESSED.');
        ctrlAddItem();
      }
    });
  }

  var ctrlAddItem = function () {

    var input, newItem;

    //1. Get the field input data
    input = UICtrl.getInput();
    //console.log(input);
      
    //2. Add the item to the budget CONTROLLER
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //3. Add the item to the ui
    //4. Calculate de budget
    //5. Display the budget on the UI
      
  }

  return {
    init: function(){
      console.log('Application has started.')
      setupEventListeners();
    }
  }
}(budgetController, UIcontroller));

controller.init();