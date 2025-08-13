document.querySelector(".runBtn").addEventListener("click", () => { // Adding a event listener to run button is clicked the options selected will be sent to the content.js
    console.log("Run Button Clicked"); // This comes in popup.html's console
    const checkedOptions = [] // Intializing empty array to store the content of the all the checked options
    document.querySelectorAll('input[type="checkbox"]').forEach((checkBox) => { // Iterate through all checkbox and if it is checked add it to the checkedOptions array
        if (checkBox.checked) {
            console.log(`Checked : ${checkBox.checked}`);
            console.log(`ID : ${checkBox.id}`);
            checkedOptions.push(checkBox.id)
        }
    })
    if (checkedOptions.length === 0) {  // To check for empty checked option and also warn the user to select some option for the extension to work

        console.log("Choose any options")
        alert("Choose any options")

    } else {
        // active true and currentWindow true proves us the array of current active tab or the one which we are on and usually it is a single element in a array 
        // To that tab(which we access through tab.id[chrome's way of doing things] we send our type or basically a label and our options which gets recived by content script which can do the injection of code into the website)
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "RUN_FEATURES",
                options: checkedOptions,
            })

        })

    }

})
