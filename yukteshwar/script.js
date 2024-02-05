document.addEventListener('DOMContentLoaded', function() {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const contentDiv = document.getElementById('content');
    let noClickCount = 0;
    const noButtonTexts = [
        "Are you sure?",
        "Do you really want to do this?",
        "But I thought we had something special!",
        "You're breaking my heart into a million pieces!",
        "I can't believe you would say no to me!",
        "You're making me question everything!",
        "But I had such high hopes for us!",
        "You're making me feel rejected!",
        "I thought you were the one!",
        "You're making me doubt our future together!",
        "But I already planned our future!",
        "You're making me feel unloved!",
        "I thought we were meant to be!",
        "You're making me feel like I'm not enough!",
        "But I already picked out our wedding colors!",
        "You're making me feel like I'm not worth it!",
        "I thought we were in this together!"
        // Add all other variations you want to cycle through
    ];

    noBtn.addEventListener('click', function() {
        if (noClickCount < 20) {
            // Increase font size more dramatically
            yesBtn.style.fontSize = `${16 + noClickCount * 5}px`; // Adjust the increment value for font size

            // Increase button size more dramatically
            yesBtn.style.width = `${100 + noClickCount * 10}px`; // Adjust the increment value for width
            yesBtn.style.height = `${50 + noClickCount * 5}px`;
        }
        noBtn.textContent = noButtonTexts[noClickCount % noButtonTexts.length];
        noClickCount++;
    });

    yesBtn.addEventListener('click', function() {
        contentDiv.innerHTML = '<img src="./mochi-and-mochi-peach-cat.gif" alt="Celebration">';
        contentDiv.innerHTML += '<p>See you for Valentine\'s!</p>';
    });
})