// HTML Templates for index.html
function signUpHTML() {
    return /*html*/ `
    <div class="header-container"></div>

    <div class="icon-container">
        <img src="./assets/img/icon.png">
    </div>
        
    <div class="content-container">
        <div class="signUpMessage" id="signUpMessage"> You joined to JOIN.</div>
        <div class="return-arrow">
            <img src="./assets/img/arrow.png" onclick="openLogIn()">
        </div>

        <span class="headline less-margin">Sign up</span>

        <div class="line"></div>

        <form class="form" onsubmit="addToUsers(); return false;">
            <input class="input" placeholder="Full Name" required type="text" id="name" style="background-image: url(./assets/img/person.png)">

            <input class="input" placeholder="Email" required type="email" id="email" style="background-image: url(./assets/img/letter.png)">

            <input class="input" placeholder="Password" required type="password" id="password" style="background-image: url(./assets/img/key.png)">
    
            <div class="btn-container width  margin-top-button">
                <button class="btn-long-dark bg-dark-blue text-white">Sign up</button>
            </div>
        </form>
    </div>
    `;
}


function logInHTML() {
    return /*html*/ `
    <div class="header-container">
        <span class="text-dark-blue">Not a Join user?</span>

        <button class="btn bg-dark-blue text-white" onclick="openSignUp()">Sign up</button>
    </div>

    <div class="icon-container">
        <img src="./assets/img/icon.png">
    </div>
        
    <div class="content-container">
        <span class="headline">Log in</span>

        <div class="line"></div>

        <form class="form" onsubmit="login(); return false;">
            <input class="input" placeholder="Email" required type="email" id="email-login" style="background-image: url(./assets/img/letter.png)">

            <input class="input" placeholder="Password" required type="password" id="password-login" style="background-image: url(./assets/img/key.png)" onclick="changeBI()">

            <span class="wrong d-none" id="wrong-password">Wrong password</span>

            <div class="click-me d-none" id="click-me" onclick="visiblePassword()"></div>

            <div class="click-me-two d-none" id="click-me-two" onclick="invisiblePassword()"></div>

            <div class="settings-container">
                <div class="remember-me">
                    <input type="checkbox" name="remember" id="checkbox" onclick="rememberMe()">

                    <label for="remember">Remember me</label>

                    <div class="uncheck-me d-none" id="uncheck" onclick="dontRememberMe()"></div>
                </div>

                <span onclick="openForgotPassword()">Forgot my password</span>
            </div>

            <div class="btn-container">
                <button class="btn-long-dark bg-dark-blue text-white">Log in</button>

                <button class="btn-long-bright bg-white text-dark-blue">Guest Log in</button>
            </div>
        </form>
    </div>
    `;
}


function passwordHTML() {
    return /*html*/ `
    <div class="header-container"></div>

    <div class="icon-container">
        <img src="./assets/img/icon.png">
    </div>
        
    <div class="content-container width-password height-mobile">
        <div class="return-arrow">
            <img src="./assets/img/arrow.png" onclick="openLogIn()">
        </div>

        <span class="headline less-margin headline-mobile">I forgot my password</span>

        <div class="line"></div>

        <span class="instructions">Don't worry! We will send you an email with the instructions to reset your password.</span>

        <form class="form" action="https://stefan-heinemann.developerakademie.net/JOIN/send_mail.php" method="POST">
            <input class="input" placeholder="Email" name="email" required type="email" id="email" style="background-image: url(./assets/img/letter.png)">
            
            <div class="btn-container width margin-top-button">
                <button class="btn-long-dark bg-dark-blue text-white width-btn">Send me the email</button>
            </div>
        </form>
    </div>
    `;
}