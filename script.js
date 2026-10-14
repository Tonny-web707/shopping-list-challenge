var itemNames = [];
var itemCosts = [];
var itemPurchasedStates = [];


if (localStorage.getItem("savedNames")) {
    itemNames = localStorage.getItem("savedNames").split(",");
    
    var loadedCosts = localStorage.getItem("savedCosts").split(",");
    for (var i = 0; i < loadedCosts.length; i++) {
        itemCosts.push(Number(loadedCosts[i]));
    }
    
    var loadedStates = localStorage.getItem("savedStates").split(",");
    for (var i = 0; i < loadedStates.length; i++) {
        if (loadedStates[i] === "true") {
            itemPurchasedStates.push(true);
        } else {
            itemPurchasedStates.push(false);
        }
    }
}


var itemInput = document.getElementById("item-input");
var costInput = document.getElementById("cost-input");
var addButton = document.getElementById("add-button");
var listContainer = document.getElementById("list-container");
var totalDisplay = document.getElementById("total-display");
var clearButton = document.getElementById("clear-button");


renderList();


addButton.addEventListener("click", function() {
    var nameText = itemInput.value;
    var costNum = Number(costInput.value);

    
    if (nameText === "") {
        alert("Please enter a name for the item.");
        return;
    }
    if (isNaN(costNum) || costNum < 0) {
        costNum = 0;
    }

    
    itemNames.push(nameText);
    itemCosts.push(costNum);
    itemPurchasedStates.push(false);

    
    saveDataToLocalStorage();
    renderList();

    
    itemInput.value = "";
    costInput.value = "";
});

function renderList() {
    listContainer.innerHTML = "";
    var currentTotalCost = 0;

    for (var i = 0; i < itemNames.length; i++) {
        var li = document.createElement("li");
        li.textContent = itemNames[i] + " - $" + itemCosts[i].toFixed(2);

    
        if (itemPurchasedStates[i] === true) {
            li.classList.add("purchased");
            currentTotalCost = currentTotalCost + itemCosts[i]; // Track cost sum of purchased items
        }

        var actionsWrapper = document.createElement("div");
        actionsWrapper.className = "item-actions";

        
        var markBtn = document.createElement("button");
        markBtn.textContent = "Mark";
        markBtn.indexTracker = i;
        markBtn.addEventListener("click", function(event) {
            var position = event.target.indexTracker;
            if (itemPurchasedStates[position] === true) {
                itemPurchasedStates[position] = false;
            } else {
                itemPurchasedStates[position] = true;
            }
            saveDataToLocalStorage();
            renderList();
        });

        
        var editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.indexTracker = i;
        editBtn.addEventListener("click", function(event) {
            var position = event.target.indexTracker;
            var changeName = prompt("Edit item description text:", itemNames[position]);
            var changePrice = prompt("Edit item valuation unit pricing:", itemCosts[position]);

            if (changeName !== null && changeName !== "") {
                itemNames[position] = changeName;
            }
            if (changePrice !== null && !isNaN(Number(changePrice))) {
                itemCosts[position] = Number(changePrice);
            }

            saveDataToLocalStorage();
            renderList();
        });

        actionsWrapper.appendChild(markBtn);
        actionsWrapper.appendChild(editBtn);
        li.appendChild(actionsWrapper);
        listContainer.appendChild(li);
    }

     
    totalDisplay.textContent = currentTotalCost.toFixed(2);
}


function saveDataToLocalStorage() {
    localStorage.setItem("savedNames", itemNames.toString());
    localStorage.setItem("savedCosts", itemCosts.toString());
    localStorage.setItem("savedStates", itemPurchasedStates.toString());
}


clearButton.addEventListener("click", function() {
    if (confirm("Reset current tracking database layout completely?")) {
        itemNames = [];
        itemCosts = [];
        itemPurchasedStates = [];
        saveDataToLocalStorage();
        renderList();
    }
});
