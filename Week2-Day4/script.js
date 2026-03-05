document.addEventListener("DOMContentLoaded", () => {
    const billInput = document.getElementById("bill");
    const peopleInput = document.getElementById("people");
    const customTipInput = document.getElementById("custom-tip");
    const tipButtons = document.querySelectorAll(".tip-btn");
    const resetBtn = document.getElementById("reset-btn");
    
    const tipAmountDisplay = document.getElementById("tip-amount");
    const totalAmountDisplay = document.getElementById("total-amount");
    
    const peopleError = document.getElementById("people-error");
    const billError = document.getElementById("bill-error");
    
    let billValue = 0.0;
    let tipPercentage = 0.0;
    let peopleCount = 0;
  
    // Functions
    function calculate() {
      if (peopleCount > 0) {
        const tipAmount = (billValue * tipPercentage) / peopleCount;
        const totalAmount = (billValue / peopleCount) + tipAmount;
        
        tipAmountDisplay.innerText = `$${tipAmount.toFixed(2)}`;
        totalAmountDisplay.innerText = `$${totalAmount.toFixed(2)}`;
        
        // Enable reset
        resetBtn.disabled = false;
      } else {
        tipAmountDisplay.innerText = "$0.00";
        totalAmountDisplay.innerText = "$0.00";
      }
    }
  
    function setTipPercentage(value) {
      tipPercentage = value / 100;
  
      // Reset active state for buttons
      tipButtons.forEach(btn => btn.classList.remove("bg-strong-cyan", "text-very-dark-cyan"));
      
      calculate();
    }
  
    function checkEnableReset() {
      if (billInput.value || peopleInput.value || customTipInput.value || tipPercentage > 0) {
        resetBtn.disabled = false;
      } else {
        resetBtn.disabled = true;
      }
    }
  
    // Listeners
    billInput.addEventListener("input", (e) => {
      if(e.target.value === "0") {
        billError.classList.remove("hidden");
        billInput.classList.add("ring-red-500", "ring-2");
        billInput.classList.remove("focus:ring-strong-cyan");
        billValue = 0;
      } else {
          billError.classList.add("hidden");
          billInput.classList.remove("ring-red-500", "ring-2");
          billInput.classList.add("focus:ring-strong-cyan");
          billValue = parseFloat(e.target.value) || 0;
      }
      calculate();
      checkEnableReset();
    });
  
    peopleInput.addEventListener("input", (e) => {
      if (e.target.value === "0") {
        peopleError.classList.remove("hidden");
        peopleInput.classList.add("ring-red-500", "ring-2");
        peopleInput.classList.remove("focus:ring-strong-cyan");
        peopleCount = 0;
      } else {
        peopleError.classList.add("hidden");
        peopleInput.classList.remove("ring-red-500", "ring-2");
        peopleInput.classList.add("focus:ring-strong-cyan");
        peopleCount = parseInt(e.target.value) || 0;
      }
      calculate();
      checkEnableReset();
    });
  
    tipButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        // Clear custom tip when a predefined one is clicked
        customTipInput.value = "";
        
        const tipValue = parseFloat(btn.getAttribute("data-tip"));
        setTipPercentage(tipValue);
        
        // Set active state for clicked button
        btn.classList.add("bg-strong-cyan", "text-very-dark-cyan");
        btn.classList.remove("text-white");
        checkEnableReset();
      });
    });
  
    customTipInput.addEventListener("input", (e) => {
      // Clear active states on buttons
      tipButtons.forEach(btn => btn.classList.remove("bg-strong-cyan", "text-very-dark-cyan"));
      
      const customValue = parseFloat(e.target.value) || 0;
      tipPercentage = customValue / 100;
      calculate();
      checkEnableReset();
    });
  
    resetBtn.addEventListener("click", () => {
      billInput.value = "";
      peopleInput.value = "";
      customTipInput.value = "";
      
      billValue = 0.0;
      tipPercentage = 0.0;
      peopleCount = 0;
      
      tipAmountDisplay.innerText = "$0.00";
      totalAmountDisplay.innerText = "$0.00";
      
      tipButtons.forEach(btn => btn.classList.remove("bg-strong-cyan", "text-very-dark-cyan"));
      
      peopleError.classList.add("hidden");
      peopleInput.classList.remove("ring-red-500", "ring-2");
      peopleInput.classList.add("focus:ring-strong-cyan");
      
      billError.classList.add("hidden");
      billInput.classList.remove("ring-red-500", "ring-2");
      billInput.classList.add("focus:ring-strong-cyan");
      
      resetBtn.disabled = true;
    });
  });
