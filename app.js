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

  var calculateTotal = function(type){
      var sum = 0;
      data.allItems[type].forEach(function(current){
        sum += current.value
      })
      data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp:[],
      inc:[]
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
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

    calculateBudget: function(){

      // Calculate total income and expensives
      calculateTotal('exp')
      calculateTotal('inc')

      // Calculate the budget
      data.budget = data.totals.inc - data.totals.exp

      // Calculate the percentage of income 

      if(data.totals.inc > 0)
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
      else {
        data.percentage = -1;
      }
    },

    getBudget: function(){
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      }
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
    incomeContainer:'.income__list',
    expensesContainer:'.expenses__list'
  }

  return {
      getInput: function(){
        return {
            type: document.querySelector(DOMstrings.inputType).value, // + (inc ) or - (exp)
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
          };
      }, 

      addListItem: function(object, type){
        var html, newHTML, element;

        // create Html string with placeHolder text
        if(type === 'inc'){
          element = DOMstrings.incomeContainer;
          html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix">  <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"> </i></button></div> </div> </div>';

        }else if (type === 'exp'){
          element = DOMstrings.expensesContainer;
          html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
        }
        // Replace the placeholder with some actual data

        newHTML = html.replace('%id%', object.id);
        newHTML = newHTML.replace('%description%', object.description);
        newHTML = newHTML.replace('%value%', object.value);


        // Insert HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
      },

      // Clear the fields in the budget
      clearFields: function(){
        
        var fields, fieldsArr;

        fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue); // returns a list

        // Array
        fieldsArr = Array.prototype.slice.call(fields); 

        // clearing all fields
        fieldsArr.forEach(function(current, i, array){
          current.value = "";
        });

        // Simple way to put the keyboard cursor 
        // into the first field so the user 
        // can keep putting values easily
        // improving their experience
        fieldsArr[0].focus();
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

    // Dectect keycode ( keyboard events ) or mouse clicks
    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13){
          //console.log('ENTER WAS PRESSED.');
        ctrlAddItem();
      }
    });
  }

  var updateBudget = function(){
    // 1. Calculate Budget
    budgetController.calculateBudget();

    // 2. Return Budget
    var budget = budgetController.getBudget(); // Object

    // 3. Display budget on UI
    console.log(budget);
  }

  var ctrlAddItem = function () {

    var input, newItem;

    //1. Get the field input data
    input = UICtrl.getInput();
    //console.log(input);

    if (input.description !== "" && !isNaN(input.value) && input.value > 0){
        //2. Add the item to the budget CONTROLLER
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. Add the item to the ui
      UIcontroller.addListItem(newItem, input.type);

      // 4. Clear fields
      UIcontroller.clearFields();

      //5. Calculate and update the budget 
      updateBudget();

      //6. Display the budget on the UI
    }
  }

  return {
    init: function(){
      console.log('Application has started.');
      setupEventListeners();
    }
  }
}(budgetController, UIcontroller));

controller.init();