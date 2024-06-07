document.addEventListener("DOMContentLoaded", function() {
    const balanceElement = document.getElementById("balance");
    const progressElement = document.getElementById("progress");
    const clickImage = document.getElementById("clickImage");

    // Load initial data from localStorage
    let balance = parseFloat(localStorage.getItem("balance")) || 0;
    let progress = parseInt(localStorage.getItem("progress")) || 0;

    // Update the display
    balanceElement.textContent = balance.toFixed(1);
    progressElement.textContent = progress;

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

    // Prevent double-tap to zoom
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });
});
