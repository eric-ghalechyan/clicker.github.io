document.addEventListener("DOMContentLoaded", function() {
    const balanceElement = document.getElementById("balance");
    const progressElement = document.getElementById("progress");
    const clickImage = document.getElementById("clickImage");
    const referralLinkInput = document.getElementById("referralLink");
    const copyButton = document.getElementById("copyButton");
    const taskList = document.getElementById("taskList");

    // Load initial data from localStorage
    let balance = parseFloat(localStorage.getItem("balance")) || 0;
    let progress = parseInt(localStorage.getItem("progress")) || 0;
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [
        { id: 1, description: 'Complete Task 1', reward: 100, completed: false },
        { id: 2, description: 'Complete Task 2', reward: 200, completed: false }
    ];

    // Update the display
    balanceElement.textContent = balance.toFixed(1);
    progressElement.textContent = progress;
    displayTasks();

    // Generate and display the referral link
    const userId = localStorage.getItem("userId") || generateUserId();
    localStorage.setItem("userId", userId);
    const referralLink = `${window.location.origin}${window.location.pathname}?ref=${userId}`;
    referralLinkInput.value = referralLink;

    // Click image event
    clickImage.addEventListener("click", function() {
        // Update balance and progress
        balance += 10;
        progress += 1;

        // Save to localStorage
        localStorage.setItem("balance", balance.toFixed(1));
        localStorage.setItem("progress", progress);

        // Update the display
        balanceElement.textContent = balance.toFixed(1);
        progressElement.textContent = progress;

        // Check if progress reached 1000
        if (progress >= 1000) {
            alert("Congratulations! You've reached the goal!");
            // Reset balance and progress
            balance = 0;
            progress = 0;
            localStorage.setItem("balance", balance.toFixed(1));
            localStorage.setItem("progress", progress);
            balanceElement.textContent = balance.toFixed(1);
            progressElement.textContent = progress;
        }
    });

    // Copy referral link to clipboard
    copyButton.addEventListener("click", function() {
        referralLinkInput.select();
        document.execCommand("copy");
        alert("Referral link copied to clipboard!");
    });

    // Handle referral logic
    const urlParams = new URLSearchParams(window.location.search);
    const referrerId = urlParams.get("ref");
    if (referrerId && referrerId !== userId) {
        handleReferral(referrerId);
    }

    // Prevent double-tap to zoom
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    function generateUserId() {
        return 'user-' + Math.random().toString(36).substr(2, 9);
    }

    function handleReferral(referrerId) {
        const hasReferred = localStorage.getItem("hasReferred");
        if (!hasReferred) {
            const referrerBalance = parseFloat(localStorage.getItem(`balance-${referrerId}`)) || 0;
            const referrerProgress = parseInt(localStorage.getItem(`progress-${referrerId}`)) || 0;
            localStorage.setItem(`balance-${referrerId}`, (referrerBalance + 50).toFixed(1)); // Reward referrer
            localStorage.setItem(`progress-${referrerId}`, referrerProgress + 5); // Reward referrer
            balance += 50; // Reward referee
            progress += 5; // Reward referee
            localStorage.setItem("balance", balance.toFixed(1));
            localStorage.setItem("progress", progress);
            balanceElement.textContent = balance.toFixed(1);
            progressElement.textContent = progress;
            localStorage.setItem("hasReferred", "true");
        }
    }

    function displayTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.textContent = `${task.description} - Reward: ${task.reward} coins`;
            taskItem.style.textDecoration = task.completed ? 'line-through' : 'none';
            taskItem.addEventListener('click', function() {
                if (!task.completed) {
                    task.completed = true;
                    balance += task.reward;
                    localStorage.setItem("balance", balance.toFixed(1));
                    balanceElement.textContent = balance.toFixed(1);
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    displayTasks();
                }
            });
            taskList.appendChild(taskItem);
        });
    }
});
